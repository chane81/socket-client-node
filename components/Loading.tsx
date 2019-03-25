import classNames from 'classnames/bind';
import React from 'react';
import styles from '../styles/Loading.scss';

const cx = classNames.bind(styles);

interface IProps {
	isBgShow: boolean;
}

const Loading: React.FC<IProps> = (props: IProps) => {
	return (
		<div className={cx('Loading', { 'bg-show': props.isBgShow })}>
			<i className='fas fa-circle-notch fa-spin fa-4x' />
		</div>
	);
};

export default Loading;
