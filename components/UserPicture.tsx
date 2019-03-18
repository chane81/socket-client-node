import _ from 'lodash';
import React from 'react';
import '../style/UserPicture.scss';

interface IProps {
	nickId: string;
	nickName: string;
}

const UserPicture: React.FC<IProps> = (props: IProps) => {
	return (
		<div className={'user'}>
			<div
				className={'user-picture'}
				style={{
					backgroundImage: `url('https://randomuser.me/api/portraits/thumb/men/${props.nickId}.jpg')`
				}}
			/>
			<div className={'user-nick'}>{props.nickName}</div>
		</div>
	);
};

export default UserPicture;
