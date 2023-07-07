import * as Yup from 'yup';
import { getOptionalUrlValidator, getStrictUrlValidator } from '../../../common/utils/url-validator.util';
import { getCommentValidator } from '../../../common/utils/comment-validator.util';

export const validationSchema = (isScam?: boolean) =>
	Yup.object().shape({
		url: getStrictUrlValidator(isScam),
		impersonatedUrl: getOptionalUrlValidator(),
		comment: getCommentValidator()
	});
