import React from 'react';
import '../styles/ChatPiece.scss';
import UserPicture from './UserPicture';

interface IProps {
	message: string;
	isSelf: boolean;
	nickName: string;
	nickId: string;
}

const ChatPiece: React.FC<IProps> = (props: IProps) => {
	// 줄바꿈을 <br /> 로 치환
	const msg = props.message.replace(/(?:\r\n|\r|\n)/g, '<br />');

	return (
		<div
			className={`root-chat-piece ${props.isSelf
				? 'chat-right'
				: 'chat-left'}`}
		>
			<div className={'chat-msg'}>
				<UserPicture
					isShadow={false}
					nickId={props.nickId}
					margin={'0.1rem 0.3rem 0.1rem -0.5rem'}
					isRead={true}
				/>
				<div>
					<span>
						<div dangerouslySetInnerHTML={{ __html: msg }} />
						<div className={'chat-nick'}>- {props.nickName} -</div>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChatPiece;
