import * as React from 'react';
import { ValidContainer } from '../../components/styled-components/main-container.styled';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import HexagonBtn from '../../components/common/hexagon-button';
import { ROUTES } from '../../components/navigator/routes.utils';
import { HeartIcon } from '../../../common/icons/heart-icon';
import { NavLinkTemplate } from '../../components/styled-components/link-template.styled';
import { useAppSelector } from '../../../event/store';
import { selectIsVerified } from '../../features/store/auth';
import AuthWrapper from '../../components/auth-wrapper/auth-wrapper.component';
import { getActiveTab } from '../../../content/features/store/source/sourceSlice';
import { getUrlType } from '../../utils';
import { EType } from '../../../api/types';
import * as Styled from '../../components/common/guard-points/guard-points.styled';
import { useNavigate } from 'react-router-dom';
import { removeWWW } from '../../../content/utils/index.util';

const ValidPage: React.FC = () => {
	const isVerified = useAppSelector(selectIsVerified);
	const activeTab = useAppSelector(getActiveTab);
	const url = activeTab ? 'www.' + removeWWW(new URL(activeTab).host) : '';
	const isSocial = url ? getUrlType(url) !== EType.WEBSITE : false;
	const navigate = useNavigate();

	return (
		<AuthWrapper Container={ValidContainer} title={!isVerified ? 'SIGN IN' : ''} to={ROUTES.SIGN_IN} showBurger>
			<Grid container direction="column" alignItems="center" justifyContent="center" mt="2rem">
				<GlobalTypography.Text
					style={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						textAlign: 'center'
					}}
					variant="subtitle1"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
				>
					{url}
				</GlobalTypography.Text>
				<GlobalTypography.Text variant="h3" colorVariant="common.white" fontWeight="fontWeightMedium">
					VALID
					{isSocial && (
						<Styled.QuestionMarkIcon
							style={{
								fontSize: '1.3rem',
								paddingBottom: '5px'
							}}
							onClick={() => navigate(ROUTES.ABOUT_SOCIALS_PAGE)}
						/>
					)}
				</GlobalTypography.Text>
				<Grid item mt="3rem">
					<HexagonBtn title="Report Scam" width="225px" link={ROUTES.SCAM_REPORT} />
				</Grid>
				<Grid item mt="0.5rem">
					<NavLinkTemplate to={ROUTES.SUPPORT_NIGHTHAWK}>
						<HexagonBtn
							title="Support Nighthawk"
							width="225px"
							icon={
								<Grid item pl="1rem" xs={1} maxHeight="2.125rem">
									<HeartIcon />
								</Grid>
							}
						/>
					</NavLinkTemplate>
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default ValidPage;
