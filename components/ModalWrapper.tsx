import React, { Component, createRef } from 'react';
import '../style/ModalWrapper.scss';

interface IProps {
	store?: any;
	isVisible: boolean;
	handleNickRegist: (nickName: string) => void;
}

class ModalWrapper extends Component<IProps> {
	private txtNickBox: any = createRef<HTMLInputElement>();

	// 확인버튼 클릭시 프로퍼티 함수에 닉네임 전달하여 수행하게 함
	public handleClick = () => {
		// store 에 닉네임 등록
		this.props.handleNickRegist(this.txtNickBox.current.value);

		// 닉네임 입력창은 초기화
		this.txtNickBox.current.value = '';
	};

	// 입력창에서 엔터키 눌렀을 때
	public handleSendKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.handleClick();
		}
	};

	// 별명입력 input 을 감싸는 div 영역에 마우스 클릭시 input 박스에 focus 주기
	public handleFocus = () => {
		this.txtNickBox.current.focus();
	};

	public render() {
		return (
			<div className={this.props.isVisible ? 'show' : 'hide'}>
				<div className='nicknm-gray-background' />
				<div className='nicknm-wrapper'>
					<div className='nicknm-modal'>
						<div className='nicknm-input-container' onClick={this.handleFocus}>
							<input
								className='nicknm-input'
								ref={this.txtNickBox}
								type='text'
								placeholder='별명을 입력해주세요!'
								onKeyPress={this.handleSendKeyPress}
							/>
							<span className='nicknm-btn-add' onClick={this.handleClick}>
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
