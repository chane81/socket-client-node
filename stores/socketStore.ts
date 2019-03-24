import _ from 'lodash';
import { flow } from 'mobx';
import { applySnapshot, Instance, types } from 'mobx-state-tree';
import messageStore, { IMessageModelType } from './messageStore';
import userCollectionStore from './userCollectionStore';

const model = types
	.model('socketModel', {
		/** 스토어 아이덴티티 */
		identifier: types.optional(types.identifier, 'socketModel'),

		/** 1:1 채팅할 유저 uniqueId */
		// activeUniqueId: types.string,

		/** 현재 접속한 유저가 보낼려는 메시지 */
		currentMessage: types.optional(
			messageStore.model,
			messageStore.defaultValue
		),

		/** 주고 받은 메시지들 */
		messages: types.array(messageStore.model),

		/** 현재 접속자의 소켓 */
		socket: types.frozen(),

		/** 현재 접속자의 소켓명 */
		socketName: types.string,

		/** 접속자들정보 collection ref */
		userCollection: types.optional(
			types.reference(userCollectionStore.model),
			() => userCollectionStore.create
		)
	})
	.actions((self) => ({
		/** 접속 소켓을 상태값에 넣어주기  */
		setSocket(socket) {
			self.socket = socket;
		},
		/** 주고 받은 메시지들 push */
		setMessagesPush(messageModel: IMessageModelType) {
			const pushMessage = { ...messageModel };
			const activeId = self.userCollection.activeUniqueId;
			const fromId = pushMessage.msgFromUniqueId;
			const toId = pushMessage.msgToUniqueId;

			// 전체 BroadCast 메시지 인지 여부
			const isBroadCast = pushMessage.msgToUniqueId === '';

			// 현재 활성화된 1:1 창에서 메시지를 받은 경우 읽었다고 데이터 set
			if (
				// 자기 자신의 메시지 이거나
				messageModel.isSelf ||
				// 전체창인데 전체메시지로 온거이거나
				(activeId === '' && isBroadCast) ||
				// 그외에는 활성화창 ID 와 동일한 from ID에 대해 true
				(activeId === fromId && toId !== '')
			) {
				pushMessage.isRead = true;
				pushMessage.user.isRead = true;
			}

			self.messages.push(pushMessage);
		},
		/** 현재 접속한 유저가 보낼려는 메시지 set  */
		setCurrentMessage(currentMessage: IMessageModelType) {
			self.currentMessage = _.cloneDeep(currentMessage);
		},
		// 소켓 close
		setSocketClose() {
			if (self.socket != null) {
				self.socket.close();
			}
		},
		// 메시지 read 처리
		setMessageRead() {
			const unreadUniqueIds: string[] = [];
			const activeId = self.userCollection.activeUniqueId;

			_.filter(self.messages, {
				isRead: false
			}).map((data: IMessageModelType) => {
				// 전체 BroadCast 메시지 인지 여부
				const isBroadCast = data.msgToUniqueId === '';

				if (
					// BroadCast 메시지가 아니면 현재 활성창 ID 와 from ID 를 매치
					(isBroadCast === false && activeId === data.msgFromUniqueId) ||
					// BroadCast 메시지 이고 창이 전체창일 경우만 매치
					(activeId === '' && isBroadCast)
				) {
					data.isRead = true;
					data.user.isRead = true;
				} else {
					unreadUniqueIds.push(isBroadCast ? '' : data.user.uniqueId);
				}
			});

			// 사용자 정보에서 read 데이터 처리
			const unreadIdGroupBy = _.uniqBy(unreadUniqueIds, (data) => data);
			self.userCollection.setUsersRead(unreadIdGroupBy);
		},
		// 소켓 send
		setSendMessage: flow(function*() {
			if (self.socket === null || self.socket.connected === false) {
				alert('서버에 연결되어 있지 않습니다.');
			} else if (self.currentMessage.message.trim() === '') {
				alert('메시지를 입력해주세요!');
			} else {
				// 소켓 emit
				yield self.socket.emit(
					'client.msg.send',
					JSON.stringify(self.currentMessage)
				);

				console.log('소켓 send:', JSON.stringify(self.currentMessage));

				// 위와 같이 spread 로 넣어주던가 lodash 를 사용해서 deep clone 해야함
				(self as any).setMessagesPush(_.cloneDeep(self.currentMessage));
			}

			// input 박스 메시지 초기화
			(self as any).setCurrentMessage(messageStore.defaultValue);
		}),
		// 초기화
		setInit() {
			applySnapshot(self, defaultValue);
		}
	}));

const defaultValue = {
	currentMessage: {
		...messageStore.defaultValue
	},
	currentNickId: '',
	currentNickName: '',
	messages: [],
	modalVisible: false,
	socket: null,
	socketName: ''
	/** 레퍼런스트입이므로 default 안함 */
	// userCollection: { ...userCollectionStore.defaultValue }
};

const create = model.create(defaultValue);

const socketStore = {
	create,
	defaultValue,
	model
};

export type ISocketModelType = Instance<typeof model>;

export default socketStore;
