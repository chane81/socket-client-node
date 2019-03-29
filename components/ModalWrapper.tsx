import classNames from 'classnames/bind';
import React, { Component, createRef } from 'react';
import styles from '../styles/ModalWrapper.scss';
import Loading from './Loading';

const cx = classNames.bind(styles);

interface IProps {
	isVisible: boolean;
	status: string;
	handleNickRegist: (nickName: string) => void;
}

class ModalWrapper extends Component<IProps> {
	private txtNickBox: any = createRef<HTMLInputElement>();

	// 닉네임 등록
	public handleClick = (e) => {
		// 앞 뒤 공백 제거
		const nickName = this.txtNickBox.current.value.replace(/^\s*|\s*$/g, '');

		// 입력값 없으면 등록 X
		if (!nickName) {
			e.preventDefault();
			return;
		}

		// store 에 닉네임 등록
		this.props.handleNickRegist(nickName);

		// 닉네임 입력창은 초기화
		this.txtNickBox.current.value = '';
	};

	// 입력창에서 엔터키 눌렀을 때
	public handleSendKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.handleClick(e);
		}
	};

	// 별명입력 input 을 감싸는 div 영역에 마우스 클릭시 input 박스에 focus 주기
	public handleFocus = () => {
		this.txtNickBox.current.focus();
	};

	public render() {
		return (
			<div
				className={cx('root-modal-wrapper', {
					hide: this.props.status === 'success'
				})}
			>
				<div />
				{this.props.status === 'pending' && <Loading isBgShow={false} />}
				<div className='nicknm-wrapper'>
					<div className='nicknm-modal'>
						<div className='nicknm-input-container' onClick={this.handleFocus}>
							<input
								ref={this.txtNickBox}
								type='text'
								placeholder='별명을 입력해주세요!'
								onKeyPress={this.handleSendKeyPress}
							/>
							<span onClick={this.handleClick}>
								<i className='fas fa-user fa-2x nicknm-user-icon' />
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ModalWrapper;
