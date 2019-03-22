import _ from 'lodash';
import { applySnapshot, Instance, types } from 'mobx-state-tree';

// 유저 모델
// const userModel = types.model('userModel', {
// 	nickId: types.string,
// 	nickName: types.string,
// 	uniqueId: types.string
// });

// 유저 컬렉션 모델
const model = types
	.model('usersModel', {
		users: types.array(
			types.model({
				nickId: types.string,
				nickName: types.string,
				uniqueId: types.string
			})
		)
	})
	.actions((self) => ({
		// 새로운 사용자가 접속시 데이터 push
		setUserIn(user) {
			self.users.push({ ...user });
		},
		// 사용자가 접속 끊었을 시 데이터 pop
		setUserOut(user) {
			// 오류발생 코드
			// _.remove(self.users, (data) => data.uniqueId === userModel.uniqueId);
			// _.pullAllBy(self.users, [ { uniqueId: userModel.uniqueId } ], 'uniqueId');

			console.log('setUserOut', JSON.stringify(self.users));

			const idx = _.findIndex(self.users, {
				uniqueId: user.uniqueId
			});
			self.users.splice(idx, 1);
		},
		// 초기화
		setInit() {
			applySnapshot(self, defaultValue);
		}
	}));

const defaultValue = {
	users: []
};

const create = model.create(defaultValue);

const usersStore = {
	create,
	defaultValue,
	model
};

export type IUsersModelType = Instance<typeof model>;

export default usersStore;
