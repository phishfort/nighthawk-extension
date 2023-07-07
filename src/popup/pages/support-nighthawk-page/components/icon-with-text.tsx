import { ButtonBase, Grid, GridSize } from '@mui/material';
import * as GlobalTypography from '../../../components/common/global-typography';

interface IProps {
	icon: JSX.Element;
	text: string;
	onClick: () => void;
	xs?: boolean | GridSize;
}
const IconWithText = ({ icon, text, onClick, xs }: IProps) => {
	return (
		<Grid display="flex" item mt="1rem" onClick={onClick} xs={xs} className="button">
			<ButtonBase>
				<Grid pt="0.2rem">{icon}</Grid>
				<GlobalTypography.Text
					colorVariant="inverted"
					pl="0.5rem"
					variant="body2"
					sx={{ justifyContent: 'center', textAlign: 'center' }}
				>
					{text}
				</GlobalTypography.Text>
			</ButtonBase>
		</Grid>
	);
};

export default IconWithText;
