import React, { FC } from 'react';
import { Grid } from '@mui/material';
import HexagonBtn from '../common/hexagon-button';
import { GoogleIcon } from '../../../common/icons/google-icon';
import { TwitterIcon } from '../../../common/icons/twitter-icon';
import { EAuthTypes, signOut } from '../../features/store/auth';
import { useAppDispatch } from '../../../event/store';
import { storageService } from '../../../api/services';
import { EXTERNAL_ROUTES } from '../navigator/routes.utils';
import { handleRedirect } from '../../utils';

interface IProps {
	type: EAuthTypes;
}

const AuthForm: FC<IProps> = ({ type }) => {
	const dispatch = useAppDispatch();

	const handleRedirectSocAuth = async () => {
		await storageService.removeTokensFromStorage();
		dispatch(signOut());
		handleRedirect(EXTERNAL_ROUTES.SIGN_UP as string);
	};

	const handleRedirectCredentials = async () => {
		await storageService.removeTokensFromStorage();
		dispatch(signOut());
		handleRedirect(EXTERNAL_ROUTES.SING_IN as string);
	};

	return (
		<Grid container direction="column" alignItems="center" justifyContent="center" rowSpacing={1} mt="1rem" mb="1.5rem">
			<Grid item>
				<HexagonBtn
					title={`Sign ${type === EAuthTypes.SIGN_UP ? 'Up' : 'In'} With Google`}
					icon={
						<Grid item maxHeight="2.3rem" pl="1rem" xs={1}>
							<GoogleIcon />
						</Grid>
					}
					width="225px"
					type={'button'}
					variant="filled"
					onClick={handleRedirectSocAuth}
				/>
			</Grid>
			<Grid item>
				<HexagonBtn
					title={`Sign ${type === EAuthTypes.SIGN_UP ? 'Up' : 'In'} With Twitter`}
					icon={
						<Grid item maxHeight="1.6rem" pl="0.75rem" xs={1}>
							<TwitterIcon />
						</Grid>
					}
					width="225px"
					type={'button'}
					variant="filled"
					onClick={handleRedirectSocAuth}
				/>
			</Grid>
			<Grid item>
				<HexagonBtn
					title={`Sign ${type === EAuthTypes.SIGN_UP ? 'Up' : 'In'} With Email`}
					width="225px"
					onClick={handleRedirectCredentials}
					type={'button'}
				/>
			</Grid>
		</Grid>
	);
};

export default AuthForm;
