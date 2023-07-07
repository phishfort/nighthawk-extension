/* eslint-disable jsx-a11y/control-has-associated-label */
import { NavLinkTemplate } from '../../styled-components/nav-link-template.styled';
import { ButtonContainer } from './hexagon-button.styled';
import { ReactNode } from 'react';
import { Grid } from '@mui/material';

interface IHexagonBtn {
	/**
	 * A title that is shown inside of a button
	 */
	title?: string | ReactNode;
	/**
	 * Variable that is responsiable for the disabled state
	 *  @default ''
	 */
	isDisabled?: boolean;
	/**
	 * Handles the click on a button
	 *  @default false
	 */
	onClick?: () => void;
	/**
	 * Describes the type of button action
	 * @default submit
	 */
	type?: 'button' | 'submit' | 'reset' | undefined;
	/**
	 * Handles linking
	 * @default ''
	 */
	link?: string;
	/**
	 * Describe width of button
	 * @default ''
	 */
	width?: string;
	/**
	 * Button variant
	 * @default ''
	 */
	variant?: 'filled' | 'outlined';
	/**
	 * Button icon
	 * @default ''
	 */
	icon?: ReactNode;
}

const HexagonBtn: React.FC<IHexagonBtn> = ({
	title = '',
	isDisabled = false,
	onClick = () => null,
	type = 'submit',
	link,
	variant,
	icon,
	width
}) => {
	const handleClick = () => {
		if (isDisabled) return null;
		onClick();
	};

	return (
		<ButtonContainer disabled={isDisabled} onClick={handleClick} width={width} variant={variant}>
			{link ? (
				<NavLinkTemplate className="link" to={link}>
					<span className="title">{title && title}</span>
				</NavLinkTemplate>
			) : (
				<span>
					<Grid container alignItems="center" justifyContent="center">
						{icon}
						<Grid item xs={11}>
							{title}
						</Grid>
					</Grid>
					<button type={type} disabled={isDisabled} />
				</span>
			)}
		</ButtonContainer>
	);
};
export default HexagonBtn;
