import * as Yup from 'yup';

export const getCommentValidator = () => Yup.string().strict(true);
