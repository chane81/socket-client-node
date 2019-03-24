import { JsonWebTokenError } from 'jsonwebtoken';
import { inject, observer } from 'mobx-react';
import React from 'react';
import io from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import ModalWrapper from '../components/ModalWrapper';
import config from '../config.js';
import { IStore } from '../stores/storeTypes';

interface IProps {
	store?: IStore;
}

const ModalWrapperContainer: React.FC<IProps> = ({ store }) => {
	const { getModalVisible } = store!;

	const { socket, setMessagesPush, setSocket } = store!.socketModel;

	const {
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
				setMessagesPush({ ...receiveMsg, isSelf: false });
			});

			// 접속 사용자정보들 push
			socketIo.on('client.user.in', (context) => {
				const user = JSON.parse(context);

				console.log('client.user.in:', user);

				setUserIn(user);
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

				console.log('client.user.out:', user);

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
