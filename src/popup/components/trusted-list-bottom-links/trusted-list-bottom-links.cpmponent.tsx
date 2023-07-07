import { FC } from 'react';
import HexagonBtn from '../common/hexagon-button';
import { LinkTemplate } from '../styled-components/link-template.styled';
import { EXTERNAL_ROUTES, ROUTES } from '../navigator/routes.utils';
import * as GlobalTypography from '../common/global-typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { handleRedirect } from '../../utils';

interface IProps {
	showLinkToYourTrusted?: boolean;
}

const TrustedListBottomLinks: FC<IProps> = ({ showLinkToYourTrusted = true }) => {
	const navigator = useNavigate();
	const handleAddTrustedClick = () => {
		navigator(ROUTES.ADD_TRUSTED);
	};

	return (
		<>
			<Grid item container ml="0.125rem">
				<HexagonBtn title="Add Trusted Site or Account" width="250px" onClick={handleAddTrustedClick} />
			</Grid>

			{showLinkToYourTrusted && (
				<LinkTemplate onClick={() => handleRedirect(EXTERNAL_ROUTES.TRUSTED_LIST)}>
					<GlobalTypography.Text
						variant="body1"
						colorVariant="common.white"
						fontFamily="IBM Plex Sans"
						fontWeight="fontWeightBold"
						mt="1.25rem"
					>
						View and Manage Your Full Trust List
					</GlobalTypography.Text>
				</LinkTemplate>
			)}

			<LinkTemplate onClick={() => handleRedirect(EXTERNAL_ROUTES.NIGHTHAWK_TRUSTED_LIST)}>
				<GlobalTypography.Text
					variant="body1"
					colorVariant="common.white"
					fontFamily="IBM Plex Sans"
					fontWeight="fontWeightBold"
					mt="1rem"
				>
					View Nighthawk’s Trust List
				</GlobalTypography.Text>
			</LinkTemplate>
		</>
	);
};

export default TrustedListBottomLinks;
