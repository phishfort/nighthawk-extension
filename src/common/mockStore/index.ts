const IS_DEV_MODE = 'development' === process.env.NODE_ENV;

const defineStore = async () => {
	const store = await (IS_DEV_MODE ? import('../../event/store') : import('../store'));
	return store?.default;
};

export default defineStore();
