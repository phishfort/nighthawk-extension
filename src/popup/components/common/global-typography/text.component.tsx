import { FC } from 'react';
import { TypographyProps } from '@mui/material';
import * as Styled from './global-typography.styled';

type TColorVariants = 'primary' | 'secondary' | 'inverted' | string;

interface IProps extends TypographyProps {
	colorVariant: TColorVariants;
	opacity?: number;
}

export const Text: FC<IProps> = ({ colorVariant, variant, align, opacity, children, ...props }) => (
	<Styled.Text color={colorVariant} variant={variant} align={align} opacity={opacity} {...props}>
		{children}
	</Styled.Text>
);
