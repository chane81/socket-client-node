import classNames from 'classnames/bind';
import React, { useState } from 'react';
import styles from '../styles/UserPicture.scss';
import { IUserModelType } from '../stores/storeTypes';
const cx = classNames.bind(styles);

interface IProps {
	userModel: IUserModelType;
	isShadow?: boolean;
	margin?: string;
	sizeRem?: string;
	isTransparent?: boolean;
	isHover?: boolean;
	isActive?: boolean;
	handleClick: (userModel: IUserModelType) => void;
}

const UserPicture: React.FC<IProps> = (props: IProps) => {
	const {
		userModel,
		isShadow = true,
		isTransparent = true,
		isHover = false,
		margin,
		sizeRem = '3rem',
		isActive = false,
		handleClick
	} = props;

	// 클릭시 백그라운드 컬러 토글을 위한 상태값
	//const [ isActiveState, setActiveState ] = useState(isActive);

	// 클릭시 백그라운드 컬러 토글
	// const handleClick = () => {

	// 	setActiveState(!isActiveState);
	// };
	console.log('UserPicture', userModel);
	return (
		<div
			onClick={() => handleClick(userModel)}
			className={cx('root-user-picture', {
				'bg-white': isActive,
				'hover-action': isHover,
				trans: isTransparent
			})}
			style={{
				margin
			}}
		>
			<div
				className={cx('user-img', {
					'user-img-shadow': isShadow
				})}
				style={{
					backgroundImage: `url('https://randomuser.me/api/portraits/thumb/men/${userModel.nickId}.jpg')`,
					backgroundSize: sizeRem,
					height: sizeRem,
					width: sizeRem
				}}
			>
				{userModel.nickId === 'all' && (
					<i className='fas fa-users fa-2x' />
				)}
			</div>
			<div className={'user-nick'}>{userModel.nickName}</div>
		</div>
	);
};

export default UserPicture;
