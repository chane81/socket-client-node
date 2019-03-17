import { applySnapshot, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import socketStore from './socketStore';

type IStore = Instance<typeof store>;
type IStoreSnapshotIn = SnapshotIn<typeof store>;
type IStoreSnapshotOut = SnapshotOut<typeof store>;
let initStore: IStore = null as any;

const store = types.model('store', {
	socketModel: socketStore.model
});

const initializeStore = (isServer, snapshot = null) => {
	const defaultValue = {
		socketModel: { ...socketStore.defaultValue }
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
