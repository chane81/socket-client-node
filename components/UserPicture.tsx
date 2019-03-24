import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { IUserModelType } from '../stores/storeTypes';
import styles from '../styles/UserPicture.scss';
const cx = classNames.bind(styles);

interface IProps {
	userModel: IUserModelType;
	isShadow?: boolean;
	margin?: string;
	sizeRem?: string;
	isTransparent?: boolean;
	isHover?: boolean;
	isActive?: boolean;
	isShowNickName?: boolean;
	propHandleUserClick?: (uniqueId: string) => void;
}

const UserPicture: React.FC<IProps> = (props: IProps) => {
	const {
		userModel,
		// nickId,
		// nickName,
		isShadow = true,
		isTransparent = true,
		isHover = false,
		margin,
		sizeRem = '3rem',
		isShowNickName = false,
		propHandleUserClick
	} = props;

	return (
		userModel && (
			<div
				onClick={() => propHandleUserClick!(userModel.uniqueId)}
				className={cx('root-user-picture', {
					'bg-white': userModel.isActive,
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
					{userModel.nickId === 'all' && <i className='fas fa-users fa-2x' />}
				</div>
				{isShowNickName && (
					<div className={'user-nick'}>{userModel.nickName}</div>
				)}
			</div>
		)
	);
};

export default observer(UserPicture);
