import * as Yup from 'yup';

export const getUsernameValidator = () =>
	Yup.string()
		.strict(true)
		.trim('Spaces before and after global-typography is not allowed.')
		.required('Username is required.')
		.min(3, 'Username is too short - should be 3 chars minimum.')
		.max(50, 'Username is long short - should be 50 chars maximum.');
