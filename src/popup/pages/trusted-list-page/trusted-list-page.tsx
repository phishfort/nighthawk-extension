import * as React from 'react';
import TrustedListItem from './components/trusted-list-item';
import {
	StyledTrustListContainer,
	StyledTrustListItemsConatiner,
	StyledTrustListMainContainer
} from './trusted-list-page.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import storeWithMiddleware from '../../../common/mockStore';
import {
	fetchTrustedList,
	removeFromTrustedList,
	selectLoadingTrustedList,
	selectTrustedList
} from '../../features/store/trusted-list';
import { useAppSelector } from '../../../event/store';
import PopupContainer from '../../components/popup-container/popup-container.component';
import TrustedListBottomLinks from '../../components/trusted-list-bottom-links/trusted-list-bottom-links.cpmponent';
import * as Styled from '../../components/common/guard-points/guard-points.styled';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../components/navigator/routes.utils';

interface ITrustedListPageProps {}

const TrustedListPage: React.FC<ITrustedListPageProps> = () => {
	const trustedList = useAppSelector(selectTrustedList) || [];
	const isLoadingTrustedList = useAppSelector(selectLoadingTrustedList);
	const navigate = useNavigate();

	React.useEffect(() => {
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchTrustedList()));
	}, []);

	const handleRemoveItem = async (id: string) => {
		// @ts-ignore
		await storeWithMiddleware.then(({ dispatch }) => dispatch(removeFromTrustedList({ id })));
		// @ts-ignore
		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchTrustedList()));
	};

	return (
		<PopupContainer>
			<StyledTrustListContainer>
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightBold" mb="1rem">
					Trust List
					<Styled.QuestionMarkIcon onClick={() => navigate(ROUTES.ABOUT_TRUSTED_LIST)} />
				</GlobalTypography.Text>

				<StyledTrustListMainContainer>
					{trustedList.length === 0 ? (
						<GlobalTypography.Text
							variant="body1"
							colorVariant="common.white"
							align="center"
							fontFamily="IBM Plex Sans"
							mb="1.5rem"
							pl="1.5rem"
							pr="1.5rem"
						>
							PhishFort maintains a list of trusted sites and accounts, but we don’t review every site and account in
							existence. If there are sites and accounts you trust, you can add them to your custom Trusted List, and
							they will appear here.
						</GlobalTypography.Text>
					) : (
						<StyledTrustListItemsConatiner>
							{trustedList.slice(0, 6).map((el: any) => (
								<TrustedListItem title={el.url} type={el.type} remove={() => handleRemoveItem(el.id)} />
							))}
						</StyledTrustListItemsConatiner>
					)}

					<TrustedListBottomLinks showLinkToYourTrusted={trustedList.length > 6} />
				</StyledTrustListMainContainer>
			</StyledTrustListContainer>
		</PopupContainer>
	);
};

export default TrustedListPage;
