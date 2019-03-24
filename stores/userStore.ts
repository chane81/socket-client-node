import { Instance, types } from 'mobx-state-tree';

// 유저 모델
const model = types
	.model('userModel', {
		/** 사용자가 메시지를 읽었는지 여부 true/false */
		isRead: types.optional(types.boolean, false),

		/** 임시부여된 닉ID(중복될 수 있음) */
		nickId: types.string,

		/** 닉네임 */
		nickName: types.string,

		/** 유니크한 ID(소켓 ID) */
		uniqueId: types.string
	})
	.actions((self) => ({
		/** 사용자가 메시지를 읽었는지 여부 true/false 세팅 */
		setRead(isRead: boolean) {
			self.isRead = isRead;
		}
	}));

const defaultValue = {
	isRead: false,
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
