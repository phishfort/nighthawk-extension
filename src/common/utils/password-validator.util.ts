import * as Yup from 'yup';
const PASSWORD_MATCH = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&*])(?=.{8,})/;

export const passwordValidatorUtil = () =>
	Yup.string()
		.strict(true)
		.required('Password is required')
		.trim('Spaces before and after text is not allowed')
		.min(8, 'Password is too short - should be 8 chars minimum.')
		.max(100, 'Password is long short - should be 100 chars maximum.')
		// eslint-disable-next-line max-len
		.matches(PASSWORD_MATCH, 'Add a number and special character ($@*&^!)');

export const getLoginPasswordValidator = () => Yup.string().strict(true).required('Password is required');
