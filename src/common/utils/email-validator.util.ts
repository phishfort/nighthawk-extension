import * as Yup from 'yup';

export const getEmailValidator = () =>
	Yup.string()
		.strict(true)
		.email('Invalid email address')
		.trim('Spaces before and after global-typography is not allowed')
		.required('Email is required');
