import { Instance, types } from 'mobx-state-tree';

// 유저 모델
const model = types
	.model('userModel', {
		// /** 이 사용자와의 1:1활성화 여부 truefalse */
		// isActive: types.optional(types.boolean, false),

		/** 임시부여된 닉ID(중복될 수 있음) */
		nickId: types.string,

		/** 닉네임 */
		nickName: types.string,

		/** 유니크한 ID(소켓 ID) */
		uniqueId: types.string
	})
	.actions((self) => ({
		/** 해당 사용자와의 1:1채팅 활성화 여부 */
		// setActive(isActive: boolean) {
		// 	self.isActive = isActive;
		// }
	}));

const defaultValue = {
	// isActive: false,
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
