import React, { FC, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import * as Styled from './autocomplete-input.styled';

export const AutocompleteInput: FC<any> = ({ passedOptions, setFieldValue, name, placeholder, ...props }) => {
	const handleChange = (_: SyntheticEvent, value: string) => {
		if (value) {
			setFieldValue(name, value);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, HTMLInputElement>) => {
		const { value } = e.target;
		if (value) {
			setFieldValue(name, value);
		}
	};

	return (
		<Autocomplete
			{...props}
			freeSolo
			onChange={handleChange}
			id="autocomplete-input"
			options={passedOptions}
			disableClearable
			sx={{ height: 22 }}
			renderInput={(params) => (
				<Styled.Input
					{...params}
					placeholder={placeholder}
					onBlur={handleBlur}
					sx={{
						'& fieldset': { border: 'none' }
					}}
				/>
			)}
		/>
	);
};
