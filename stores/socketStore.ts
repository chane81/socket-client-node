import _ from 'lodash';
import { flow } from 'mobx';
import { applySnapshot, Instance, types } from 'mobx-state-tree';
import messageStore, { IMessageModelType } from './messageStore';
import { IUserModelType } from './storeTypes';
import userCollectionStore from './userCollectionStore';

const model = types
	.model('socketModel', {
		/** 스토어 아이덴티티 */
		identifier: types.optional(types.identifier, 'socketModel'),

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

		/** 소켓 연결상태: ready, pending, success, fail */
		status: types.string,

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
		/** 소켓 커넥션 시도시에 상태값 변경 */
		setSocketStatus(status: string) {
			self.status = status;
		},
		/** 주고 받은 메시지들 push */
		setMessagesPush(messageModel: IMessageModelType) {
			const pushMessage = { ...messageModel };
			const activeId = self.userCollection.activeUniqueId;
			const fromId = pushMessage.msgFromUniqueId;
			const toId = pushMessage.msgToUniqueId;
			const isSelf = messageModel.isSelf;
			let isRead: boolean = false;

			// 전체 BroadCast 메시지 인지 여부
			const isBroadCast = pushMessage.msgToUniqueId === '';

			// 사용자정보 get
			const userModel: IUserModelType = self.userCollection.getUser(
				isBroadCast ? '' : pushMessage.user.uniqueId
			);

			// 현재 활성화된 1:1 창에서 메시지를 받은 경우 읽었다고 데이터 set
			isRead =
				// 자기 자신의 메시지 이거나
				messageModel.isSelf ||
				// 전체창인데 전체메시지로 온거이거나
				(activeId === '' && isBroadCast) ||
				// 그외에는 활성화창 ID 와 동일한 from ID에 대해 true
				(activeId === fromId && toId !== '');

			// 메시지 읽음 처리
			pushMessage.isRead = isRead;

			// 사용자 정보 읽음 처리
			if (isSelf === false) {
				userModel.setReadValue(isRead);
			}

			// 메시지 상태값에 push
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
		/** 해당 사용자의 메시지에 대해 모두 읽음 처리 */
		setMessageRead(uniqueId: string) {
			console.log('setMessageRead:', uniqueId);
			const userModel: IUserModelType = self.userCollection.getUser(uniqueId);

			_.filter(self.messages, (data: IMessageModelType) => {
				return (
					// 읽지 않은 메시지 가져오고
					data.isRead === false &&
					// 전체메시지 이면 toUniqueId 가 빈걸로 가져오고
					((uniqueId === '' && data.msgToUniqueId === '') ||
						// 그외에는 uniqueId 에 해당하는 메시지 데이터 가져옴
						data.user.uniqueId === uniqueId)
				);
			}).map((data: IMessageModelType) => {
				data.isRead = true;
				userModel.setReadValue(true);
			});
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

				// console.log('소켓 send:', JSON.stringify(self.currentMessage));

				// 메시지를 store에 push
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
	socketName: '',
	status: 'ready'
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
