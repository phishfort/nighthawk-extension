import { Store, applyMiddleware } from 'webext-redux';
import thunkMiddleware from 'redux-thunk';
import { PORT_STORE_NAME } from '../constants/app-keys.const';
import eventStore from '../../event/store';

const IS_DEV_MODE = 'development' === process.env.NODE_ENV;

const store = new Store({
	state: {},
	portName: PORT_STORE_NAME
});

const middleware = [thunkMiddleware];
export const storeWithMiddleware = IS_DEV_MODE ? eventStore : applyMiddleware(store, ...middleware);

export default store;
