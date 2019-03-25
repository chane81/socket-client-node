import {
	applySnapshot,
	Instance,
	SnapshotIn,
	SnapshotOut,
	types
} from 'mobx-state-tree';
import socketStore from './socketStore';
import userCollectionStore from './userCollectionStore';

type IStore = Instance<typeof store>;
type IStoreSnapshotIn = SnapshotIn<typeof store>;
type IStoreSnapshotOut = SnapshotOut<typeof store>;
let initStore: IStore = null as any;

const store = types
	.model('store', {
		/** 스토어 아이덴티티 */
		identifier: types.optional(types.identifier, 'store'),

		/** 모달 visible 여부 true/false */
		modalVisible: types.optional(types.boolean, false),

		/** 소켓 모델 */
		socketModel: types.optional(socketStore.model, () => socketStore.create),

		/** 사용자 컬렉션 모델 */
		userCollectionModel: types.optional(
			userCollectionStore.model,
			() => userCollectionStore.create
		)
	})
	.views((self) => ({
		/** 모달을 보여줘야할지 여부 */
		get getModalVisible() {
			return self.socketModel.status !== 'success';
		}
	}));

const initializeStore = (isServer, snapshot = null) => {
	const defaultValue = {
		modalVisible: false,
		socketModel: { ...socketStore.defaultValue },
		userCollectionModel: { ...userCollectionStore.defaultValue }
	};

	// 서버일 경우에 대한 로직 작성
	if (isServer) {
		initStore = store.create(defaultValue);
	}

	// 클라이언트일 경우에 대한 로직 작성
	if ((store as any) === null) {
		initStore = store.create(defaultValue);
	}

	// 스냅샷 있을 경우 스토어에 스냅샷을 적용
	if (snapshot) {
		applySnapshot(initStore, snapshot);
	}

	return initStore;
};

export { initializeStore, IStore, IStoreSnapshotIn, IStoreSnapshotOut };
