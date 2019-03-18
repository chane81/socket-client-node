import { JsonWebTokenError } from 'jsonwebtoken';
import { inject, observer } from 'mobx-react';
import React from 'react';
import io from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import ModalWrapper from '../components/ModalWrapper';
import config from '../config.js';
import { IStore } from '../stores/store';

interface IProps {
	store?: IStore;
}

const ModalWrapperContainer: React.FC<IProps> = ({ store }) => {
	const {
		socket,
		setMessagesPush,
		setSocket,
		setCurrentNickName,
		setCurrentNickId,
		getModalVisible,
		setUserIn,
		setUserOut
	} = store!.socketModel;

	const handleNickRegist = (nickName) => {
		// 닉네임을 상태에 등록
		setCurrentNickName(nickName);

		// 임시닉 ID 발급(랜덤사진 보여주기위해)
		const currentNickId = setCurrentNickId();

		if (socket == null) {
			// json 객체의 크기 축소, 바이너리 전송을 위해 message pack 적용
			// 일반 json 데이터 전송보다 빠름
			const socketIo = io(config.socketServerHost, {
				parser: msgpackParser,
				query: {
					nickId: currentNickId,
					nickName,
					socketName: 'web'
				},
				secure: true,
				transports: [ 'websocket', 'polling' ]
			});

			// 접속한 소켓 set
			socketIo.on('connect', () => {
				setSocket(socketIo);
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

				setUserIn(user);
			});

			// 사용자가 처음 접속시에 현재 접속한 유저들정보를 가져온다.
			socketIo.on('client.current.users', (context) => {
				console.log('client.current.users', context);

				const users = JSON.parse(context);

				users.map((data) => {
					setUserIn(data);
				});
			});

			// 접속끊긴 사용자정보들 remove
			socketIo.on('client.user.out', (context) => {
				const user = JSON.parse(context);

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
