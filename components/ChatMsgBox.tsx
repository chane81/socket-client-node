import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { IMessageModelType, IUsersModelType } from '../stores/storeTypes';
import '../styles/ChatMsgBox.scss';
import ChatPiece from './ChatPiece';
import UserPicture from './UserPicture';

interface IProps {
	propHandleChange: (currentMessage: string) => void;
	propHandleSend: () => void;
	propHandleSignout: () => void;
	propMessages: IMessageModelType[];
	propUsers: IUsersModelType;
	propCurrentMessage: string;
}

// 해당 컴포넌트기능 외부 노출용 인터페이스
interface IChatMsgBoxObj {
	handleBoxClick: () => void;
	txtChat: HTMLInputElement;
}

// mobx inject 로 감싸져 export 가 되었으므로 wrappedInstance 로 노출해야함
interface IChatMsgBox {
	wrappedInstance: IChatMsgBoxObj;
}

class ChatMsgBox extends Component<IProps> {
	// ref 객체
	public txtChat: HTMLInputElement;
	private chatBox: HTMLDivElement;

	// 컴포넌트 update 시 스크롤 맨 아래로 이동
	public componentDidUpdate(prevProps, prevStates) {
		this.fnScrollMove();
	}

	// 챗박스 감싸고 있는 부분 클릭시 인풋박스 포커스이동되게 함
	public handleBoxClick = () => {
		this.txtChat.focus();
	};

	// 스크롤 맨 아래로
	private fnScrollMove() {
		const { scrollHeight, clientHeight } = this.chatBox;
		this.chatBox.scrollTop = scrollHeight - clientHeight;
	}

	// 소켓 전송
	// setSendMessage 가 비동기 이므로 async await 를 써서 스크롤 맨아래로내리는 부분 제대로 수행되게 함
	private handleSend = async () => {
		await this.props.propHandleSend();

		// 스크롤 맨 아래로
		this.fnScrollMove();
	};

	// 입력창에서 엔터키 눌렀을 때
	private handleSendKeyPress = async (e) => {
		if (e.key === 'Enter') {
			await this.handleSend();
		}
	};

	// 전송할 텍스트 입력
	private handleChange = (e) => {
		this.props.propHandleChange(e.target.value);
	};

	// 나가기 클릭
	private handleSignout = () => {
		this.props.propHandleSignout();
	};

	public render() {
		const { propMessages, propUsers, propCurrentMessage } = this.props;

		return (
			<div className={'root-chat-msg-box'}>
				<div className={'users-and-chat'}>
					<div className={'user-wrap'}>
						<div
							style={{
								display: 'flex',
								flexFlow: 'column'
							}}
						>
							<i className='fas fa-users' />
							<div>전체</div>
						</div>
						{propUsers.users.map((data) => (
							<UserPicture
								nickId={data.nickId}
								nickName={data.nickName}
								key={data.uniqueId}
								isShadow={true}
								sizeRem={'2.5rem'}
								isTransparent={false}
								isHover={true}
							/>
						))}
					</div>
					<div
						ref={(ref: HTMLDivElement) => (this.chatBox = ref)}
						className={'chat-box'}
					>
						{propMessages.map((data, index) => (
							<ChatPiece
								isSelf={data.isSelf}
								message={data.message}
								nickName={data.nickName}
								nickId={data.nickId}
								key={index}
							/>
						))}
					</div>
				</div>

				<div className={'chat-input-box'} onClick={this.handleBoxClick}>
					<span
						className={'btn-out-container'}
						onClick={this.handleSignout}
					>
						<i className={'fas fa-sign-out-alt btn-icon'} />
					</span>
					<input
						id='txtChat'
						onChange={this.handleChange}
						ref={(ref: HTMLInputElement) => (this.txtChat = ref)}
						onKeyPress={this.handleSendKeyPress}
						value={propCurrentMessage}
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

// export default ChatMsgBox;
// inject 로 감싸여진 컴포넌트의 ref 호출 실험을 위해서 아래 구문으로 함
export { IChatMsgBox };
export default inject(({ store }) => ({ store }))(observer(ChatMsgBox));
