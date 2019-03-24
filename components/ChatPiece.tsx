import React from 'react';
import { IMessageModelType } from '../stores/storeTypes';
import '../styles/ChatPiece.scss';
import UserPicture from './UserPicture';

interface IProps {
	messageModel: IMessageModelType;
}

const ChatPiece: React.FC<IProps> = (props: IProps) => {
	const { isSelf, message, user } = props.messageModel;
	const { isActive, nickName, nickId, uniqueId } = user;

	// 줄바꿈을 <br /> 로 치환
	const msg = message.replace(/(?:\r\n|\r|\n)/g, '<br />');

	return (
		<div className={`root-chat-piece ${isSelf ? 'chat-right' : 'chat-left'}`}>
			<div className={'chat-msg'}>
				<UserPicture
					userModel={user}
					margin={'0.1rem 0.3rem 0.1rem -0.5rem'}
					isShadow={false}
				/>
				<div>
					<span>
						<div dangerouslySetInnerHTML={{ __html: msg }} />
						<div className={'chat-nick'}>- {nickName} -</div>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChatPiece;
