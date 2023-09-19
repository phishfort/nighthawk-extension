import * as Yup from 'yup';

export const URL_MATCH = /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/;
export const NOT_EMPTY = /^\S*$/;

export const getOptionalUrlValidator = () =>
	Yup.string()
		.strict(true)
		.trim('Spaces before and after is not allowed.')
		.matches(NOT_EMPTY, 'Spaces are not allowed.')
		.min(1, 'URL is too short - should be 1 char minimum.')
		.max(400, 'URL is too long - should be 400 chars maximum.')
		.nullable();

export const getStrictOptionalUrlValidator = (isScam?: boolean) =>
	getOptionalUrlValidator().matches(
		URL_MATCH,
		`Sorry, ${
			isScam ? "the item couldn't be reported" : 'we could not add the item to your list'
		}. Please, make sure it complies with the required link format and try again`
	);

export const getUrlValidator = () => getOptionalUrlValidator().required('URL is required.');
export const getImpersonatedUrlValidator = () => getOptionalUrlValidator().required('ImpersonatedUrl is required');
export const getEmailValidator = () => getOptionalUrlValidator().required('Email is required').email('Email not valid');

export const getStrictUrlValidator = (isScam?: boolean) =>
	getStrictOptionalUrlValidator(isScam).required('URL is required.');
