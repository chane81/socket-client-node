import { inject, observer } from 'mobx-react';
import { onAction, onPatch } from 'mobx-state-tree';
import React, { Component } from 'react';
import ChatMsgBox, { IChatMsgBox } from '../components/ChatMsgBox';
import { IStore } from '../stores/storeTypes';

interface IProps {
	store?: IStore;
}

class ChatMsgBoxContainer extends Component<IProps> {
	// private chatMsgBox = createRef();
	private chatMsgBox: IChatMsgBox;

	// 소켓 연결
	public componentDidMount() {
		const store = this.props.store!;

		// mst action 이벤트 핸들러
		onAction(store, (action) => {
			if (action.name === 'setCurrentNickName') {
				console.log('mst onAction:', action);
			}
		});

		// mst patch 이벤트 핸들러
		onPatch(store, (patch) => {
			if (
				patch.op === 'replace' &&
				patch.path.indexOf('currentNickName') !== -1
			) {
				console.log('mst onPatch:', patch);

				// 닉네임 입력 모달창 닫았을 때 input 입력박스로 focus 이동
				setTimeout(() => {
					// (this.chatMsgBox.wrappedInstance as IChatMsgBox).handleBoxClick();
					// this.chatMsgBox.txtChat.focus();
					this.chatMsgBox.handleBoxClick();
				});
			}
		});
	}

	public handleSignout = () => {
		const { socketModel, usersModel } = this.props.store!;

		// 소캣닫기
		socketModel.setSocketClose();

		// 소캣 스토어 초기화
		socketModel.setInit();
		usersModel.setInit();
	};

	public render() {
		const { socketModel, usersModel } = this.props.store!;

		return (
			<div>
				<ChatMsgBox
					propCurrentMessage={socketModel.currentMessage.message}
					propHandleChange={socketModel.setCurrentMessage}
					propHandleSend={socketModel.setSendMessage}
					propHandleSignout={this.handleSignout}
					propMessages={socketModel.messages}
					propUsers={usersModel}
					/* 아래 wrappedInstance 중요함 */
					/* 컴포넌트가 mobx inject로 감싸진 경우에 wrappedInstance 로 써야함 */
					ref={(ref: any) => (this.chatMsgBox = ref.wrappedInstance)}
				/>
			</div>
		);
	}
}

export default inject(({ store }) => ({ store }))(
	observer(ChatMsgBoxContainer)
);
