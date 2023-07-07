import React from 'react';
import { Grid } from '@mui/material';
import * as Styled from './guard-points.styled';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigator/routes.utils';
import HexagonPoints from '../hexagon-points';

interface IGuardPoints {
	points?: string;
}

export const GuardPoints: React.FC<IGuardPoints> = ({ points }) => {
	const navigate = useNavigate();

	return (
		<Grid item container direction="column" alignItems="center" justifyContent="center">
			<HexagonPoints title={points} />
			<Styled.HexagonLabel>
				Guardian Point
				<Styled.QuestionMarkIcon onClick={() => navigate(ROUTES.ABOUT_GUARDIAN_POINTS)} />
			</Styled.HexagonLabel>
		</Grid>
	);
};
