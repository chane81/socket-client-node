import _ from 'lodash';
import { flow } from 'mobx';
import { applySnapshot, types } from 'mobx-state-tree';
import messageStore, { IMessageModelType } from './messageStore';
import userStore, { IUserModelType } from './userStore';

const model = types
	.model('socketModel', {
		currentMessage: messageStore.model,
		currentNickId: types.string,
		currentNickName: types.string,
		messages: types.array(messageStore.model),
		modalVisible: types.boolean,
		socket: types.frozen(),
		socketName: types.string,
		users: types.array(userStore.model)
	})
	.actions((self) => ({
		// 접속 소켓을 상태값에 넣어주기
		setSocket(socket) {
			self.socket = socket;
		},
		// 주고 받은 메시지들 push
		setMessagesPush(messageModel: IMessageModelType) {
			self.messages.push({ ...messageModel });
		},
		// 현재 접속한 유저의 닉네임 set
		setCurrentNickName(currentNickName) {
			self.currentNickName = currentNickName;
		},
		// 현재 접속한 유저가 보낼려는 메시지 set
		setCurrentMessage(message) {
			self.currentMessage = {
				isSelf: true,
				message,
				nickId: self.currentNickId,
				nickName: self.currentNickName
			};
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
				(self as any).setMessagesPush(self.currentMessage);
			}

			// input 박스 메시지 초기화
			(self as any).setCurrentMessage('');
		}),
		// 모달 visible 세팅
		setModalVisible() {
			self.modalVisible = false;
		},
		// 현재사용자의 임시ID
		setCurrentNickId() {
			return (self.currentNickId = Math.floor(Math.random() * 50).toString());
		},
		// 나가기를 눌렀을 때 쓰는 초기화
		setInit() {
			applySnapshot(self, defaultValue);
		},
		// 새로운 사용자가 접속시 데이터 push
		setUserIn(userModel: IUserModelType) {
			self.users.push({ ...userModel });
		},
		// 사용자가 접속 끊었을 시 데이터 pop
		setUserOut(userModel) {
			// _.remove(self.users, (data) => data.uniqueId === userModel.uniqueId);
			// _.pullAllBy(self.users, [ { uniqueId: userModel.uniqueId } ], 'uniqueId');

			const idx = _.findIndex(self.users, { uniqueId: userModel.uniqueId });
			self.users.splice(idx, 1);
		}
	}))
	.views((self) => ({
		// 모달을 보여줘야할지 여부
		get getModalVisible() {
			return self.currentNickName ? false : true;
		},
		get getSocket() {
			return self.socket;
		},
		get getCurrentNickId() {
			return self.currentNickId;
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
};

const create = model.create(defaultValue);

const socketStore = {
	create,
	defaultValue,
	model
};

export default socketStore;
