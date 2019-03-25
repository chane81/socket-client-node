import { inject, observer } from 'mobx-react';
import React from 'react';
import io from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import ModalWrapper from '../components/ModalWrapper';
import config from '../config.js';
import {
	IMessageModelType,
	IStore,
	IUserModelType
} from '../stores/storeTypes';

interface IProps {
	store?: IStore;
}

const ModalWrapperContainer: React.FC<IProps> = ({ store }) => {
	const { getModalVisible } = store!;

	const {
		socket,
		setMessageRead,
		setMessagesPush,
		setSocket,
		setSocketStatus,
		status
	} = store!.socketModel;

	const {
		activeUniqueId,
		getRandomId,
		setUserIn,
		setUserOut,
		setCurrentUser,
		currentUser
	} = store!.userCollectionModel;

	const handleNickRegist = (nickName) => {
		// 소켓 pending 상태로 변경
		setSocketStatus('pending');

		// 임시 닉ID 발급
		const nickId = getRandomId();

		if (socket === null) {
			// json 객체의 크기 축소, 바이너리 전송을 위해 message pack 적용
			// 일반 json 데이터 전송보다 빠름
			const socketIo = io(config.socketServerHost, {
				parser: msgpackParser,
				query: {
					nickId,
					nickName,
					socketName: 'web'
				},
				reconnection: false,
				transports: [ 'websocket', 'polling' ]
			});

			// 소켓 connect 이벤트 발생시
			socketIo.on('connect', () => {
				// 접속한 소켓 set
				setSocket(socketIo);

				// 접속유저의 uniqueId 등록
				setCurrentUser(nickName, nickId, socketIo.id);

				// 소켓 상태값 변경
				setSocketStatus('success');
			});

			// 서버에서 메시지 받았을 때
			socketIo.on('client.msg.receive', (context) => {
				// console.log('받은메시지:', context);

				const receiveMsg = JSON.parse(context);

				// 메시지들 배열에 push
				setMessagesPush({ ...receiveMsg });

				// console.log('client.msg.receive', receiveMsg);
			});

			// 접속 사용자정보들 push
			socketIo.on('client.user.in', (context) => {
				const user: IUserModelType = JSON.parse(context);

				// 접속했다고 메시지 등록
				const message: IMessageModelType = {
					isRead: activeUniqueId === '',
					isSelf: false,
					message: user.nickName + '(이)가 접속 하였습니다.',
					msgFromUniqueId: '',
					msgToUniqueId: '',
					user: { ...user }
				};

				const pushUser: IUserModelType = {
					...user,
					isRead: activeUniqueId === ''
				};

				// 사용자 등록
				setUserIn(pushUser);

				// 메시지 push
				setMessagesPush(message);
			});

			// 사용자가 처음 접속시에 현재 접속한 유저들정보를 가져온다.
			socketIo.on('client.current.users', (context) => {
				// console.log('client.current.users', context);

				const reqUsersData = JSON.parse(context);

				reqUsersData.map(
					(data) => data.uniqueId !== currentUser.uniqueId && setUserIn(data)
				);
			});

			// 접속끊긴 사용자정보들 remove
			socketIo.on('client.user.out', (context) => {
				const user = JSON.parse(context);

				// 접속 끊었다고 메시지 등록
				const message: IMessageModelType = {
					isRead: activeUniqueId === '',
					isSelf: false,
					message: user.nickName + '(이)가 퇴장 하였습니다.',
					msgFromUniqueId: '',
					msgToUniqueId: '',
					user: { ...user }
				};

				// 메시지 push
				setMessagesPush(message);

				// 사용자 제거
				setUserOut(user);
			});

			// 커넥션 에러
			socketIo.on('connect_error', () => {
				setSocketStatus('fail');

				alert('연결에 실패하였습니다.');

				console.log('connect_error');
			});

			// 커넥션 끊겼을 때
			socketIo.on('disconnect', () => {
				setSocketStatus('fail');

				console.log('서버 disconnected!');
			});
		}
	};

	return (
		<ModalWrapper
			isVisible={getModalVisible}
			handleNickRegist={handleNickRegist}
			status={status}
		/>
	);
};

export default inject(({ store }) => ({ store }))(
	observer(ModalWrapperContainer)
);
