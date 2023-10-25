import React, { Dispatch, FC, useEffect } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Grid } from '@mui/material';
import { FormFieldContainer } from '../form-field-container';
import * as Styled from './form-input.styled';
import { AutocompleteInput } from './autocomplete-input';
import { INighthawkList } from '../../../pages/trusted-list-page/trusted-list.types';
import { getCustomErrorMsg } from './utils';
import { getValidUrl } from '../../../../api/utils/validate-url';

export interface IProps {
	name: string;
	type: string;
	placeholder?: string;
	maxLength?: number;
	disabled?: boolean | undefined;
	passedValue: string;
	passedOptions?: string[];
	greyList?: string[];
	blackList?: INighthawkList[];
	onSetCustomErrors?: Dispatch<React.SetStateAction<boolean>>;
	notTouchable?: boolean;
	page?: string;
	whiteList?: INighthawkList[];
}

const FormInput: FC<IProps> = ({
	name,
	type,
	placeholder,
	maxLength,
	disabled,
	passedValue,
	passedOptions,
	greyList,
	blackList,
	onSetCustomErrors,
	notTouchable,
	page,
	whiteList
}) => {
	const { values, handleChange, errors, touched, setFieldValue } = useFormikContext();
	const value = getIn(values, name) || passedValue;

	const isBlackListError = blackList && blackList.some((el) => getValidUrl(el.url) === getValidUrl(value));
	const isWhiteListError = whiteList && whiteList.some((el) => getValidUrl(el.url) === getValidUrl(value));
	const isSpamReportError = greyList && page === 'scam-report' ? greyList.some((el) => value.includes(el)) : false;
	const isTrustListError = greyList && page === 'trust-list' ? greyList.some((el) => value.includes(el)) : false;

	const isErrorExists =
		(getIn(errors, name) && (getIn(touched, name) || notTouchable)) ||
		isBlackListError ||
		isTrustListError ||
		isSpamReportError ||
		isWhiteListError;

	useEffect(() => {
		if (onSetCustomErrors) {
			if (isBlackListError || isTrustListError || isSpamReportError || isWhiteListError) {
				onSetCustomErrors(true);
			} else {
				onSetCustomErrors(false);
			}
		}
	}, [isBlackListError, isTrustListError, isSpamReportError, isWhiteListError]);

	return (
		<Grid>
			<FormFieldContainer error={isErrorExists}>
				<Styled.Input
					id={name}
					name={name}
					type={type}
					onChange={handleChange(name)}
					value={value}
					placeholder={placeholder}
					maxLength={maxLength}
					disabled={disabled}
					passedOptions={passedOptions}
					setFieldValue={setFieldValue}
					as={passedOptions && AutocompleteInput}
				/>
			</FormFieldContainer>
			{isErrorExists && (
				<Styled.ErrorInfoContainer>
					<Styled.ErrorInfoText>
						{getIn(errors, name) ||
							getCustomErrorMsg({
								isBlackListError,
								isTrustListError,
								isSpamReportError,
								isWhiteListError
							})}
					</Styled.ErrorInfoText>
				</Styled.ErrorInfoContainer>
			)}
		</Grid>
	);
};

export default FormInput;
