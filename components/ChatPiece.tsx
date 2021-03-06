import React from 'react';
import { IMessageModelType } from '../stores/storeTypes';
import '../styles/ChatPiece.scss';
import UserPicture from './UserPicture';

interface IProps {
	messageModel: IMessageModelType;
}

const ChatPiece: React.FC<IProps> = (props: IProps) => {
	const { isSelf, message, user } = props.messageModel;
	const { nickName } = user;

	// 줄바꿈을 <br /> 로 치환
	const msg = message.replace(/(?:\r\n|\r|\n)/g, '<br>');

	return (
		<div
			data-testid='t-root-class'
			className={`root-chat-piece ${isSelf ? 'chat-right' : 'chat-left'}`}
		>
			<div className={'chat-msg'}>
				<UserPicture
					userModel={user}
					margin={'0.1rem 0.3rem 0.1rem -0.5rem'}
					isShadow={false}
					isRead={true}
				/>
				<div>
					<span>
						<div
							data-testid='t-msg'
							dangerouslySetInnerHTML={{ __html: msg }}
						/>
						<div data-testid='t-nick-name' className={'chat-nick'}>
							- {nickName} -
						</div>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChatPiece;
