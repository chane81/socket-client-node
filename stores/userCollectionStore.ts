import _ from 'lodash';
import { applySnapshot, Instance, types } from 'mobx-state-tree';
import userStore, { IUserModelType } from './userStore';

// 유저 컬렉션 모델
const model = types
	.model('userCollectionModel', {
		/** 스토어 아이덴티티 */
		identifier: types.optional(types.identifier, 'userCollectionModel'),

		/** 현재 사용자 정보 */
		currentUser: userStore.model,

		/** 접속사용자들 정보 컬렉션 */
		users: types.array(userStore.model),

		/** 1:1 채팅할 유저 uniqueId */
		activeUniqueId: types.string
	})
	.actions((self) => ({
		/** 현재 접속한 유저정보 set  */
		setCurrentUser(currentNickName) {
			// 닉네임 set
			self.currentUser.nickName = currentNickName;

			// 1:1 사용자 활성화여부 false
			// self.currentUser.isActive = false;

			// 닉ID set
			self.currentUser.nickId = Math.floor(Math.random() * 50).toString();
		},
		/** 1:1 채팅할 상대 uniqueId set */
		setActiveUniqueId(uniqueId: string) {
			self.activeUniqueId = uniqueId;
		},
		/** 유니크ID set */
		setCurrentUniqueId(currentUniqueId) {
			self.currentUser.uniqueId = currentUniqueId;
		},
		/** 새로운 사용자가 접속시 데이터 push */
		setUserIn(user: IUserModelType) {
			self.users.push({ ...user });
		},
		/** 사용자가 접속 끊었을 시 데이터 pop */
		setUserOut(user: IUserModelType) {
			// 오류발생 코드
			// _.remove(self.users, (data) => data.uniqueId === userModel.uniqueId);
			// _.pullAllBy(self.users, [ { uniqueId: userModel.uniqueId } ], 'uniqueId');

			console.log('setUserOut', JSON.stringify(self.users));

			// 만약 나가는 사용자가 현재 1:1 채팅중인 사용자라면 '전체' 로 채팅방을 바꾼다.
			self.activeUniqueId =
				self.activeUniqueId === user.uniqueId ? '' : self.activeUniqueId;

			const idx = _.findIndex(self.users, {
				uniqueId: user.uniqueId
			});

			self.users.splice(idx, 1);
		},
		/** 초기화 */
		setInit() {
			applySnapshot(self, defaultValue);
		}
	}));

const defaultValue = {
	activeUniqueId: '',
	currentUser: userStore.defaultValue,
	users: [
		{
			// isActive: true,
			nickId: 'all',
			nickName: '전체',
			uniqueId: ''
		}
	]
};

// const defaultValue = {
// 	currentUser: userStore.defaultValue,
// 	users: [ { ...userStore.defaultValue } ]
// };

const create = model.create(defaultValue);

const userCollectionStore = {
	create,
	defaultValue,
	model
};

export type IUserCollectionModelType = Instance<typeof model>;

export default userCollectionStore;
