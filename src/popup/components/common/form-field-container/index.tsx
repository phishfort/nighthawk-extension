import React from 'react';
import { Styled } from './form-field.styled';

export interface IFormSelectProps {
	children: React.ReactNode;
	error?: boolean;
	height?: string;
	rows?: number;
}

export const FormFieldContainer: React.FC<IFormSelectProps> = ({ children, error, height, rows }) => {
	return (
		<Styled.HexagonBorder error={error} height={height} rows={rows}>
			<span>{children}</span>
		</Styled.HexagonBorder>
	);
};
