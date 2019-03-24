import _ from 'lodash';
import { flow } from 'mobx';
import { applySnapshot, Instance, types } from 'mobx-state-tree';
import messageStore, { IMessageModelType } from './messageStore';
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
			self.messages.push({ ...messageModel });
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

				// 메시지들 배열에 push
				// const pushMessage: IMessageModelType = {
				// 	isSelf: self.currentMessage.isSelf,
				// 	message: self.currentMessage.message,
				// 	user: { ...self.currentMessage.user }
				// };

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
