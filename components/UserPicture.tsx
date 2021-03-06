import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import React from 'react';
import { IUserModelType } from '../stores/storeTypes';
import styles from '../styles/UserPicture.scss';
const cx = classNames.bind(styles);

interface IProps {
	activeUniqueId?: string;
	userModel: IUserModelType;
	isShadow?: boolean;
	margin?: string;
	sizeRem?: string;
	isTransparent?: boolean;
	isHover?: boolean;
	isActive?: boolean;
	isShowNickName?: boolean;
	isRead?: boolean;
	propHandleUserClick?: (uniqueId: string) => void;
}

const UserPicture: React.FC<IProps> = (props: IProps) => {
	const {
		activeUniqueId = '',
		userModel,
		isShadow = true,
		isTransparent = true,
		isHover = false,
		margin,
		sizeRem = '3rem',
		isShowNickName = false,
		isRead = false,
		propHandleUserClick
	} = props;

	const backgroundImage =
		(userModel.uniqueId !== '' &&
			`url('https://randomuser.me/api/portraits/thumb/men/${userModel.nickId}.jpg')`) ||
		'';

	const isActive = userModel.uniqueId === activeUniqueId;

	return (
		userModel && (
			<div
				onClick={() => propHandleUserClick!(userModel.uniqueId)}
				className={cx('root-user-picture', {
					'bg-white': isActive,
					'hover-action': isHover,
					trans: isTransparent
				})}
				style={{
					margin
				}}
			>
				<div className={cx('msg-unread', { hide: isRead })}>
					{userModel.unreadCount}
				</div>
				<div
					className={cx('user-img', {
						'user-img-shadow': isShadow
					})}
					style={{
						backgroundImage,
						backgroundSize: sizeRem,
						height: sizeRem,
						width: sizeRem
					}}
				>
					{userModel.uniqueId === '' && <i className='fas fa-users fa-2x' />}
				</div>
				{isShowNickName && (
					<div className={'user-nick'}>{userModel.nickName}</div>
				)}
			</div>
		)
	);
};

export default observer(UserPicture);
