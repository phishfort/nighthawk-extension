import * as Yup from 'yup';
import { getStrictUrlValidator } from '../../../common/utils/url-validator.util';
import { getCommentValidator } from '../../../common/utils/comment-validator.util';

export const validationSchema = () =>
	Yup.object().shape({
		url: getStrictUrlValidator(),
		comment: getCommentValidator()
	});
