import eventStore from '../../event/store';
import store from '../store';

const IS_DEV_MODE = 'development' === process.env.NODE_ENV;

// These stores are already bundled statically. Dynamic imports use a DOM script
// loader, which is unavailable in service workers and unsafe for content worlds.
export default Promise.resolve(IS_DEV_MODE ? eventStore : store);
