import { Instance, types } from 'mobx-state-tree';

// 유저 모델
const model = types.model('userModel', {
	nickId: types.string,
	nickName: types.string,
	uniqueId: types.string
});

const defaultValue = {
	nickId: '',
	nickName: '',
	uniqueId: ''
};

const create = model.create(defaultValue);

const userStore = {
	create,
	defaultValue,
	model
};

export type IUserModelType = Instance<typeof model>;

export default userStore;
