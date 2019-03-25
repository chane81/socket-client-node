import classNames from 'classnames/bind';
import React from 'react';
import styles from '../styles/Loading.scss';

const cx = classNames.bind(styles);

interface IProps {
	isBgShow: boolean;
}

const Loading: React.FC<IProps> = (props: IProps) => {
	console.log('bgShow', props.isBgShow);
	return (
		<div className={cx('Loading', { 'bg-show': props.isBgShow })}>
			<img src='/static/images/loading.gif' alt='loading' />
		</div>
	);
};

export default Loading;
