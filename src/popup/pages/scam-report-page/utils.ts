import * as Yup from 'yup';
import {
	getEmailValidator,
	getImpersonatedUrlValidator,
	getStrictUrlValidator
} from '../../../common/utils/url-validator.util';
import { getCommentValidator } from '../../../common/utils/comment-validator.util';

export const validationSchema = (isScam?: boolean) =>
	Yup.object().shape({
		url: getStrictUrlValidator(isScam),
		impersonatedUrl: getImpersonatedUrlValidator(),
		comment: getCommentValidator(),
		email: getEmailValidator()
	});
