import { inject, observer } from 'mobx-react';
import { onAction, onPatch } from 'mobx-state-tree';
import React, { Component } from 'react';
import ChatMsgBox, { IChatMsgBox } from '../components/ChatMsgBox';
import { IMessageModelType, IStore } from '../stores/storeTypes';

interface IProps {
	store?: IStore;
}

class ChatMsgBoxContainer extends Component<IProps> {
	// ChatMsgBox 의 ref 객체
	// private chatMsgBox = createRef();
	private chatMsgBox: IChatMsgBox;

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
				// 컴포넌트가 mobx inject로 감싸진 경우에 wrappedInstance 로 써야함
				setTimeout(() => {
					// (this.chatMsgBox
					// 	.wrappedInstance as IChatMsgBox).handleBoxClick();
					this.chatMsgBox.wrappedInstance!.handleBoxClick();
				});
			}
		});
	}

	// 나가기 클릭시
	public handleSignout = () => {
		const { socketModel, userCollectionModel } = this.props.store!;

		// 소캣닫기
		socketModel.setSocketClose();

		// 소캣 스토어 초기화
		socketModel.setInit();
		userCollectionModel.setInit();
	};

	public handleUserClick = (uniqueId: string) => {
		const { userCollectionModel } = this.props.store!;
		userCollectionModel.setUserActive(uniqueId);
		// this.forceUpdate();
	};

	// 현재 사용자가 메시지 입력시 상태값에 메시지 저장
	public handleSetCurrentMessage = (currentMessage: string) => {
		const { socketModel, userCollectionModel } = this.props.store!;

		const msg: IMessageModelType = {
			isSelf: true,
			message: currentMessage,
			user: { ...userCollectionModel.currentUser }
		};

		socketModel.setCurrentMessage(msg);
	};

	public render() {
		const { socketModel, userCollectionModel } = this.props.store!;

		return (
			<div>
				<ChatMsgBox
					ref={(ref: any) => (this.chatMsgBox = ref)}
					propHandleUserClick={this.handleUserClick}
					propHandleChange={this.handleSetCurrentMessage}
					propHandleSignout={this.handleSignout}
					propMessages={socketModel.messages}
					propUsers={userCollectionModel}
					propCurrentMessage={socketModel.currentMessage.message}
					propHandleSend={socketModel.setSendMessage}
				/>
			</div>
		);
	}
}

export default inject(({ store }) => ({ store }))(
	observer(ChatMsgBoxContainer)
);
