import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import Head from '../components/Head';

import ChatMsgBoxContainer from '../containers/ChatMsgBoxContainer';
import ModalWrapperContainer from '../containers/ModalWrapperContainer';

interface IProps {
	store?: any;
}

class Index extends Component<IProps> {
	public componentWillUnmount() {
		const { store: { socketModel } } = this.props;
		socketModel.setSocketClose();
	}

	public render() {
		return (
			<div>
				<Head title='My Chat App' />
				<ChatMsgBoxContainer />
				<ModalWrapperContainer />
			</div>
		);
	}
}

export default inject(({ store }) => ({ store }))(observer(Index));
