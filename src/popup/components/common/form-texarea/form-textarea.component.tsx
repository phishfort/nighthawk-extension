import React, { FC } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Grid } from '@mui/material';
import { FormFieldContainer } from '../form-field-container';
import * as Styled from './form-textarea.styled';

const ROW_LENGTH = 25;
const INIT_FIELD_HEIGHT = 40;
const ROW_HEIGHT = 18;
const ALLOW_ROWS_COUNT = 5;
const INIT_ROW_COUNT = 2;

export interface IProps {
	name: string;
	type: string;
	placeholder?: string;
	disabled?: boolean | undefined;
	passedValue: string;
}

const FormTextarea: FC<IProps> = ({ name, type, placeholder, disabled, passedValue }) => {
	const { values, handleChange, errors, touched, setErrors } = useFormikContext();
	// @ts-ignore
	const comment = values.comment;
	const getRowsCount = (text: string) => {
		const rowsByEnter = text.split('\n').length;
		const rowsByLength = Math.ceil(text.length / ROW_LENGTH);

		const rows = Math.max(rowsByEnter, rowsByLength);
		return rows < INIT_ROW_COUNT ? INIT_ROW_COUNT : rows;
	};
	const rowCounts = getRowsCount(comment);
	const fieldHeight = `${INIT_FIELD_HEIGHT + (rowCounts - 1) * ROW_HEIGHT}px`;
	const maxLength = rowCounts > ALLOW_ROWS_COUNT ? comment.length : ALLOW_ROWS_COUNT * ROW_LENGTH;

	const isLengthErrors = getIn(values, name)?.length >= maxLength;
	const isErrorExists = (getIn(errors, name) && getIn(touched, name)) || isLengthErrors;

	if (isLengthErrors) {
		setErrors({
			...errors,
			[name]: 'Comment is too long'
		});
	}

	return (
		<Grid>
			<FormFieldContainer error={isErrorExists} height={fieldHeight} rows={rowCounts}>
				<Styled.Textarea
					as="textarea"
					id={name}
					name={name}
					type={type}
					onChange={handleChange(name)}
					value={getIn(values, name) || passedValue}
					placeholder={placeholder}
					maxLength={maxLength}
					disabled={disabled}
				/>
			</FormFieldContainer>
			{isErrorExists && (
				<Styled.ErrorInfoContainer>
					<Styled.ErrorInfoText>{getIn(errors, name) || 'Comment is too long'}</Styled.ErrorInfoText>
				</Styled.ErrorInfoContainer>
			)}
		</Grid>
	);
};

export default FormTextarea;
