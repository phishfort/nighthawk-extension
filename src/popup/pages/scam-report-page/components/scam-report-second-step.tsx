import React, { Dispatch } from 'react';
import HexagonBtn from '../../../components/common/hexagon-button';
import { Grid } from '@mui/material';
import FormInput from '../../../components/common/form-input/form-input.component';
import FormTextarea from '../../../components/common/form-texarea/form-textarea.component';
import { INighthawkList } from '../../trusted-list-page/trusted-list.types';
import { handleScamPlaceholder } from '../../../utils';
import { EType } from '../../../../api/types';

interface IProps {
	isValidButton?: boolean;
	passedOptions?: string[];
	greyList?: string[];
	blackList?: INighthawkList[];
	onSetCustomErrors: Dispatch<React.SetStateAction<boolean>>;
	currentType: EType;
}

const ScamReportForm: React.FC<IProps> = ({
	currentType,
	isValidButton,
	passedOptions,
	greyList,
	blackList,
	onSetCustomErrors
}) => {
	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Grid item minWidth="100%">
				<FormInput
					placeholder={handleScamPlaceholder(currentType)}
					type="text"
					name="url"
					passedValue=""
					greyList={greyList}
					blackList={blackList}
					onSetCustomErrors={onSetCustomErrors}
					page="scam-report"
				/>
			</Grid>
			<Grid item minWidth="100%">
				<FormInput
					placeholder="Impersonated URL (Optional)"
					type="text"
					name="impersonatedUrl"
					passedValue=""
					passedOptions={passedOptions}
					notTouchable
				/>
			</Grid>
			<Grid item minWidth="100%">
				<FormTextarea
					placeholder="How did you come across this URL? (Optional)"
					type="text"
					name="comment"
					passedValue=""
				/>
			</Grid>
			<Grid mt="0.5rem">
				<HexagonBtn title="Send Report" width="250px" isDisabled={!isValidButton} />
			</Grid>
		</Grid>
	);
};

export default ScamReportForm;
