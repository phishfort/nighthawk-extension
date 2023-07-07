import * as Yup from 'yup';

export const getSelectValidator = () => Yup.string().strict(true).required('Type is required.');
