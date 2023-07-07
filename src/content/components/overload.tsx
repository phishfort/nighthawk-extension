import { FC, ReactNode, useState } from 'react';
import { Store } from 'webext-redux';
import { RootState } from '../../event/store';

interface OverloadProps {
	children: ReactNode;
	store: Store;
}
const Overload: FC<OverloadProps> = ({ children, store }) => {
	const [state, setState] = useState<RootState | null>(null);
	const [isLoading, setLoading] = useState(false);
	const protocol = document.location.protocol;

	store
		.ready()
		.then(() => {
			const newState = store.getState();
			setState(newState);
			setLoading(true);
		})
		.catch((err) => console.log('\nerror', err));

	if (!isLoading || protocol === 'chrome-extension:') {
		return null;
	}

	return <>{children}</>;
};

export default Overload;
