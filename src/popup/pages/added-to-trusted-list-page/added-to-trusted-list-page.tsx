import * as React from 'react';
import * as GlobalTypography from '../../components/common/global-typography';
import PopupContainer from '../../components/popup-container/popup-container.component';
import { useAppSelector } from '../../../event/store';
import { selectAddedInfo, selectTrustedListError } from '../../features/store/trusted-list';
import TrustedListBottomLinks from '../../components/trusted-list-bottom-links/trusted-list-bottom-links.cpmponent';
import * as Styled from './added-to-trusted.styled';
import { renderTrustedItem } from '../../utils/trusted-item-icon.util';
import { Grid } from '@mui/material';
import { getValidUrl } from '../../utils';

const AddedToTrustedListPage: React.FC = () => {
	const addedInfo = useAppSelector(selectAddedInfo);
	const error = useAppSelector(selectTrustedListError);
	const alreadyExist = error === 'item already exists';
	const url = addedInfo?.url ? getValidUrl(addedInfo?.url) : '';

	return (
		<PopupContainer>
			{alreadyExist ? (
				<GlobalTypography.Text
					variant="subtitle2"
					align="center"
					colorVariant="common.white"
					fontWeight="fontWeightMedium"
					m="1rem"
				>
					The URL you are attempting to add is already on your Trusted List
				</GlobalTypography.Text>
			) : (
				<GlobalTypography.Text
					variant="subtitle1"
					align="center"
					colorVariant="common.white"
					fontWeight="fontWeightBold"
					mt="1rem"
					mb="1rem"
				>
					{`${addedInfo?.label} Added`}
				</GlobalTypography.Text>
			)}

			<Styled.UrlContainer item container alignItems="center">
				<Grid item container xs={2} alignItems="center" justifyContent="center">
					{renderTrustedItem(addedInfo?.type)}
				</Grid>
				<Grid item xs={10}>
					<GlobalTypography.Text
						variant="subtitle2"
						colorVariant="text.primary"
						fontFamily="IBM Plex Sans"
						fontWeight="fontWeightMedium"
					>
						{url}
					</GlobalTypography.Text>
				</Grid>
			</Styled.UrlContainer>

			<TrustedListBottomLinks />
		</PopupContainer>
	);
};

export default AddedToTrustedListPage;
