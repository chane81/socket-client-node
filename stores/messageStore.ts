import { Instance, types } from 'mobx-state-tree';
import userStore from './userStore';

// 채팅 메시지 모델
const model = types.model('messageModel', {
	/** 내가 보낸 메시지 인지여부 true/false  */
	isSelf: types.boolean,

	/** 메시지 읽었는지여부 true/false */
	isRead: types.boolean,

	/** 메시지  받는이 uniqueId */
	msgToUniqueId: types.string,

	/** 채팅메시지 */
	message: types.string,

	/** 메시지 주체 유저 */
	user: userStore.model
});

const defaultValue = {
	isRead: false,
	isSelf: false,
	message: '',
	msgToUniqueId: '',
	user: userStore.defaultValue
};

const create = model.create(defaultValue);

const messageStore = {
	create,
	defaultValue,
	model
};

export type IMessageModelType = Instance<typeof model>;

export default messageStore;
