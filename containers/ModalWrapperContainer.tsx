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
		setSocket
	} = store!.socketModel;

	const {
		activeUniqueId,
		setUserIn,
		setUserOut,
		setCurrentUser,
		setCurrentUniqueId,
		currentUser
	} = store!.userCollectionModel;

	const handleNickRegist = (nickName) => {
		// 접속유저정보 상태에 등록
		setCurrentUser(nickName);

		if (socket == null) {
			// json 객체의 크기 축소, 바이너리 전송을 위해 message pack 적용
			// 일반 json 데이터 전송보다 빠름
			const socketIo = io(config.socketServerHost, {
				parser: msgpackParser,
				query: {
					nickId: currentUser.nickId,
					nickName,
					socketName: 'web'
				},
				secure: true,
				transports: [ 'websocket', 'polling' ]
			});

			// 소켓 connect 이벤트 발생시
			socketIo.on('connect', () => {
				// 접속한 소켓 set
				setSocket(socketIo);

				// 접속유저의 uniqueId 등록
				setCurrentUniqueId(socketIo.id);
			});

			// 서버에서 메시지 받았을 때
			socketIo.on('client.msg.receive', (context) => {
				console.log('받은메시지:', context);

				const receiveMsg = JSON.parse(context);

				// 메시지들 배열에 push
				setMessagesPush({ ...receiveMsg });

				// message read 처리
				setMessageRead();
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

				// 메시지 push
				setMessagesPush(message);

				// 사용자 등록
				setUserIn(pushUser);
			});

			// 사용자가 처음 접속시에 현재 접속한 유저들정보를 가져온다.
			socketIo.on('client.current.users', (context) => {
				console.log('client.current.users', context);

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
				console.log('socket error');
			});

			// 커넥션 끊겼을 때
			socketIo.on('disconnect', () => {
				console.log('서버 disconnected!');
			});
		}
	};

	return (
		<ModalWrapper
			isVisible={getModalVisible}
			handleNickRegist={handleNickRegist}
		/>
	);
};

export default inject(({ store }) => ({ store }))(
	observer(ModalWrapperContainer)
);
