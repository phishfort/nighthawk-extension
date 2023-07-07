import * as React from 'react';
import { Grid } from '@mui/material';
import CrossIcon from '../../../components/common/icons/cross-icon';
import * as Styled from './trusted-list-item.styled';
import * as GlobalTypography from '../../../components/common/global-typography';
import { renderTrustedItem } from '../../../utils/trusted-item-icon.util';
import { EType } from '../../../../api/types';

interface TrustedListItemProps {
	title: string;
	type: EType;
	remove: Function;
}

const TrustedListItem: React.FC<TrustedListItemProps> = ({ title, type, remove }) => {
	return (
		<Styled.StyledTrustListItem>
			<Grid item container alignItems="center" justifyContent="center">
				{renderTrustedItem(type)}
			</Grid>
			<GlobalTypography.Text
				variant="subtitle2"
				colorVariant="text.primary"
				fontFamily="IBM Plex Sans"
				fontWeight="fontWeightMedium"
				pl="0.675rem"
				pr="0.5rem"
				sx={{
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					overflow: 'hidden'
				}}
			>
				{title.slice(0, 30)}
			</GlobalTypography.Text>
			<Styled.CloseIconContainer item container alignItems="center">
				<CrossIcon onClick={remove} />
			</Styled.CloseIconContainer>
		</Styled.StyledTrustListItem>
	);
};

export default TrustedListItem;
