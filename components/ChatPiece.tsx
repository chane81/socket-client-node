import React from 'react';
import '../style/ChatPiece.scss';

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
		<div className={`chat-msg-wrap ${props.isSelf ? 'chat-right' : 'chat-left'}`}>
			<div className={'chat-msg'}>
				<div
					className={'chat-picture'}
					style={{
						backgroundImage: `url('https://randomuser.me/api/portraits/thumb/men/${props.nickId}.jpg')`
					}}
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
