import { flow } from 'mobx';
import { applyPatch, applySnapshot, types } from 'mobx-state-tree';
import io from 'socket.io-client';
import config from '../config.js';
import messageStore from './messageStore';

const model = types
	.model('socketModel', {
		currentMessage: messageStore.model,
		currentNickId: types.string,
		currentNickName: types.string,
		messages: types.array(messageStore.model),
		modalVisible: types.boolean,
		socket: types.frozen(),
		socketName: types.string
	})
	.actions((self) => ({
		// 접속 소켓을 상태값에 넣어주기
		setSocket(socket): any {
			self.socket = socket;
		},
		// 소켓 커넥션과 이벤트등록
		setSocketConnect() {
			if (self.socket === (null as any)) {
				const socket = io(config.socketServerHost, {
					query: {
						socketName: '테스트'
					},
					secure: true,
					transports: [ 'websocket', 'polling' ]
				});

				// 접속한 소켓 set
				socket.on('connect', () => {
					(self as any).setSocket(socket);
				});

				socket.on('client.msg.receive', (context) => {
					console.log('받은메시지:', context);

					const receiveMsg = JSON.parse(context);

					// 메시지들 배열에 push
					(self as any).setMessagesPush({ ...receiveMsg, isSelf: false });
				});

				socket.on('connect_error', () => {
					console.log('socket error');
				});

				socket.on('disconnect', () => {
					console.log('서버 disconnected!');
				});
			}
		},
		// 주고 받은 메시지들 push
		setMessagesPush(messageModel) {
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
				yield self.socket.emit('client.msg.send', JSON.stringify(self.currentMessage));

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
		setInit() {
			applySnapshot(self, defaultValue);
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
