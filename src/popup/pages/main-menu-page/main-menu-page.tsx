import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../event/store';
import HexagonBtn from '../../components/common/hexagon-button';
import LinkButton from '../../components/common/link';
import { EXTERNAL_ROUTES, ROUTES } from '../../components/navigator/routes.utils';
import PopupContainer from '../../components/popup-container/popup-container.component';
import { Styled } from './main-menu-styled';
import { selectIsVerified, signOut } from '../../features/store/auth';
import { LinkTemplate } from '../../components/styled-components/link-template.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import { renderMenu } from './utils';
import { clearTrustedList } from '../../features/store/trusted-list';
import { clearUserInfo } from '../../features/store/user';
import { storageService } from '../../../api/services';
import { handleRedirect } from '../../utils';

const MainMenu: React.FC = () => {
	const isVerified = useAppSelector(selectIsVerified);
	const dispatch = useAppDispatch();

	const handleAuth = async () => {
		await storageService.removeTokensFromStorage();
		dispatch(signOut());
	};

	const handleSignOut = async () => {
		await handleAuth();
		dispatch(clearTrustedList());
		dispatch(clearUserInfo());
		await storageService.removePointsFromStorage();
		handleRedirect(EXTERNAL_ROUTES.SING_IN as string);
	};

	return (
		<PopupContainer>
			<Styled.StyledMainMenuWrapper>
				<HexagonBtn title="Report a Scam" width="225px" link={ROUTES.SCAM_REPORT} type={'button'} />

				<Styled.CentralContainer>
					{renderMenu(isVerified, handleAuth)?.map((link) => (
						<LinkButton key={link.path} title={link.title} to={link.path} onClick={link.onClick} />
					))}
					{isVerified && (
						<LinkButton onClick={handleSignOut} key={ROUTES.SIGN_IN} title="Sign Out" to={ROUTES.SIGN_IN} />
					)}
					<Styled.Footer>
						<LinkTemplate onClick={() => handleRedirect(EXTERNAL_ROUTES.TERMS_AND_CONDITIONS)}>
							<GlobalTypography.Text
								variant="caption"
								colorVariant="common.white"
								fontFamily="IBM Plex Sans"
								fontWeight="fontWeightBold"
							>
								TERMS AND CONDITIONS
							</GlobalTypography.Text>
						</LinkTemplate>
						<LinkTemplate onClick={() => handleRedirect(EXTERNAL_ROUTES.PRIVACY_POLICY)}>
							<GlobalTypography.Text
								variant="caption"
								colorVariant="common.white"
								fontFamily="IBM Plex Sans"
								fontWeight="fontWeightBold"
							>
								PRIVACY POLICY
							</GlobalTypography.Text>
						</LinkTemplate>
					</Styled.Footer>
				</Styled.CentralContainer>
			</Styled.StyledMainMenuWrapper>
		</PopupContainer>
	);
};

export default MainMenu;
