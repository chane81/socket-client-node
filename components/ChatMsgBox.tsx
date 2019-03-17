import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { onAction, onPatch } from 'mobx-state-tree';
import React, { Component, createRef } from 'react';

import '../style/ChatMsgBox.scss';
import ChatPiece from './ChatPiece';

interface IProps {
	store?: any;
}

class ChatMsgBox extends Component<IProps> {
	private chatBox: any = createRef<HTMLDivElement>();
	private txtChat: any = createRef<HTMLInputElement>();
	private socketModel: any = this.props.store.socketModel;

	public componentDidMount(): void {
		// mobx-state-tree patch 이벤트 핸들러
		onPatch(this.props.store, (patch) => {
			if (patch.op === 'replace' && patch.path.indexOf('currentNickName') > -1) {
				// 레이어 닫혔을 때 커서가 입력창으로 가게 수정
				// 레이어에서 그냥 별명치고 엔터 쳤을 때는 메시지 입력 박스로 포커스가 이동이 되었다.
				// 레이어에서 별명치고 버튼을 클릭했을 때는 레이어 닫힌 후 입력 박스로 포커스가 바로 이동이 되지 않았다.
				// 아래 setTimeout 로 해결함
				setTimeout(() => this.txtChat.current.focus());
			}
		});
	}

	// 컴포넌트 update 시 스크롤 맨 아래로 이동
	public componentDidUpdate(prevProps, prevStates) {
		this.fnScrollMove();
	}

	// 스크롤 맨 아래로
	public fnScrollMove() {
		const { scrollHeight, clientHeight } = this.chatBox.current;
		this.chatBox.current.scrollTop = scrollHeight - clientHeight;
	}

	// 소켓 전송
	// setSendMessage 가 비동기 이므로 async await 를 써서 스크롤 맨아래로내리는 부분 제대로 수행되게 함
	public handleSend = async () => {
		// const { store: { socketModel } } = this.props;

		// socket emit
		await this.socketModel.setSendMessage(this.txtChat.value);

		// 스크롤 맨 아래로
		this.fnScrollMove();
	};

	// 입력창에서 엔터키 눌렀을 때
	public handleSendKeyPress = async (e) => {
		if (e.key === 'Enter') {
			await this.handleSend();
		}
	};

	// 전송할 텍스트 입력
	public handleChange = (e) => {
		// const { store: { socketModel } } = this.props;

		this.socketModel.setCurrentMessage(e.target.value);
	};

	// 챗박스 감싸고 있는 부분 클릭시 인풋박스 포커스이동되게 함
	public handleBoxClick = () => {
		this.txtChat.current.focus();
	};

	public handleSignout = () => {
		// const { store: { socketModel } } = this.props;

		// 소캣닫기
		this.socketModel.setSocketClose();

		// 소캣 스토어 초기화
		this.socketModel.setInit();
	};

	public render() {
		const { store: { socketModel } } = this.props;
		const { messages, currentMessage: { message } } = socketModel;

		const chatPieces = messages.map((data, index) => (
			<ChatPiece
				isSelf={data.isSelf}
				message={data.message}
				nickName={data.nickName}
				nickId={data.nickId}
				key={index}
			/>
		));

		return (
			<div className={'chat-wrap'}>
				<div ref={this.chatBox} className={'chat-box'}>
					{chatPieces}
				</div>
				<div className={'chat-input-box shadow'} onClick={this.handleBoxClick}>
					<span className={'btn-out-container'} onClick={this.handleSignout}>
						<i className={'fas fa-sign-out-alt btn-icon'} />
					</span>
					<input
						onChange={this.handleChange}
						ref={this.txtChat}
						onKeyPress={this.handleSendKeyPress}
						value={message}
						type='text'
						placeholder='메시지를 입력해 주세요!'
					/>
					<span className={'btn-add-container'} onClick={this.handleSend}>
						<i className={'fas fa-plus btn-icon'} />
					</span>
				</div>
			</div>
		);
	}
}

export default inject(({ store }) => ({ store }))(observer(ChatMsgBox));
