import classNames from 'classnames/bind';
import React from 'react';
import styles from '../styles/UserPicture.scss';

const cx = classNames.bind(styles);

interface IProps {
	nickId: string;
	nickName?: string;
	isShadow?: boolean;
	margin?: string;
	sizeRem?: string;
	isTransparent?: boolean;
	isHover?: boolean;
}

const UserPicture: React.FC<IProps> = (props: IProps) => {
	const {
		nickId,
		nickName,
		isShadow = true,
		isTransparent = true,
		isHover = false,
		margin,
		sizeRem = '3rem'
	} = props;

	return (
		<div
			className={cx('user', {
				'hover-action': isHover,
				trans: isTransparent
			})}
			style={{
				margin
			}}
		>
			<div
				className={cx('user-picture', {
					'user-picture-shadow': isShadow
				})}
				style={{
					backgroundImage: `url('https://randomuser.me/api/portraits/thumb/men/${nickId}.jpg')`,
					backgroundSize: sizeRem,
					height: sizeRem,
					width: sizeRem
				}}
			/>
			<div className={'user-nick'}>{nickName}</div>
		</div>
	);
};

export default UserPicture;
