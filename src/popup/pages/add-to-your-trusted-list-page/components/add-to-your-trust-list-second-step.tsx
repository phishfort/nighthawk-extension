import React, { Dispatch, useState } from 'react';
import HexagonBtn from '../../../components/common/hexagon-button';
import { Grid } from '@mui/material';
import FormInput from '../../../components/common/form-input/form-input.component';
import FormTextarea from '../../../components/common/form-texarea/form-textarea.component';
import { INighthawkList } from '../../trusted-list-page/trusted-list.types';
import { handleTrustPlaceholder } from '../../../utils';
import { EType } from '../../../../api/types';

interface AddTrustListFormProps {
	isValidButton?: boolean;
	greyList?: string[];
	blackList?: INighthawkList[];
	onSetCustomErrors: Dispatch<React.SetStateAction<boolean>>;
	currentType: EType;
}

const AddTrustListForm: React.FC<AddTrustListFormProps> = ({
	isValidButton,
	greyList,
	blackList,
	onSetCustomErrors,
	currentType
}) => {
	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Grid item minWidth="100%">
				<FormInput
					placeholder={handleTrustPlaceholder(currentType)}
					type="text"
					name="url"
					passedValue=""
					greyList={greyList}
					blackList={blackList}
					onSetCustomErrors={onSetCustomErrors}
					page="trust-list"
				/>
			</Grid>
			<Grid item minWidth="100%">
				<FormTextarea placeholder="Comment (Optional)" type="text" name="comment" passedValue="" />
			</Grid>
			<Grid mt="0.5rem">
				<HexagonBtn title="Add Item To Trust List" width="250px" isDisabled={!isValidButton} />
			</Grid>
		</Grid>
	);
};

export default AddTrustListForm;
