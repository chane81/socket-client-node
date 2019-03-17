import { inject, observer } from 'mobx-react';
import { onAction, onPatch } from 'mobx-state-tree';
import { Component } from 'react';
import ChatMsgBox from '../components/ChatMsgBox';

interface IProps {
	store?: any;
}

class ChatMsgBoxContainer extends Component<IProps> {
	// 소켓 연결
	public componentDidMount() {
		const { store } = this.props;
		// const { socket, setSocket, setSocketConnect, setMessagesPush } = store.socketModel;

		// autorun(() => {
		//   console.log('test');
		// })

		// // mobx-state-tree patch 이벤트 핸들러
		// onPatch(store, patch => {
		//    if (patch.op === "replace" && patch.path.indexOf("currentNickName") > -1) {
		//       console.log("mst onPatch", patch);

		//       // 레이어 닫혔을 때 커서가 입력창으로 가게 수정
		//       this.txtChat.focus();
		//    }
		// });

		// mst action 이벤트 핸들러
		onAction(store, (action) => {
			if (action.name === 'setCurrentNickName') {
				console.log('mst onAction:', action);
			}
		});

		// mst patch 이벤트 핸들러
		onPatch(store, (patch) => {
			if (patch.op === 'replace' && patch.path.indexOf('currentNickName') !== -1) {
				console.log('mst onPatch:', patch);
			}
		});
	}

	public render() {
		// const { store: { socketModel } } = this.props;

		return <ChatMsgBox />;
	}
}

export default inject(({ store }) => ({ store }))(observer(ChatMsgBoxContainer));
