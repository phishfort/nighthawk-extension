//@ts-nocheck
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import { FormFieldContainer } from '../../components/common/form-field-container';
import { FormSelectProps } from '../../components/common/form-field-container/types';
import { Select } from '../../components/common/select/select';
import useStep from '../../hooks/useStepHook';
import AddTrustListForm from './components/add-to-your-trust-list-second-step';
import { validationSchema } from './utils';
import * as GlobalTypography from '../../components/common/global-typography';
import PopupContainer from '../../components/popup-container/popup-container.component';
import storeWithMiddleware from '../../../common/mockStore';
import {
	addToTrustedList,
	fetchNighthawkBlackList,
	fetchNighthawkGreyList,
	selectBlackList,
	selectGreyList
} from '../../features/store/trusted-list';
import { ROUTES } from '../../components/navigator/routes.utils';
import { EType } from '../../../api/types';
import { useAppSelector } from '../../../event/store';
import { SOC_MEDIA } from '../../../common/constants/app-keys.const';
import { useEffect, useState } from 'react';
import { getActiveTab } from '../../../content/features/store/source/sourceSlice';
import { handleFormType, options } from '../../utils';
import { storageService } from '../../../api/services';
interface AddTrustedPageProps {}

const MAX_STEPS = 2;

const AddTrustedPage: React.FC<AddTrustedPageProps> = () => {
	const navigate = useNavigate();
	const activeTab = useAppSelector(getActiveTab);
	const greyList = useAppSelector(selectGreyList);
	const blackList = useAppSelector(selectBlackList);
	const [currentStep, { canGoToNextStep, reset, setStep }] = useStep(MAX_STEPS);
	const [customErrors, setCustomErrors] = useState<boolean>(false);

	const isNotWebsite = !activeTab?.includes('http') || Object.values(SOC_MEDIA).some((el) => activeTab?.includes(el));
	const initUrl = isNotWebsite ? '' : activeTab;
	const initSelectValue = isNotWebsite
		? null
		: {
				label: 'Website',
				value: EType.WEBSITE
		  };
	const [selectedValue, setSelectedValue] = React.useState<FormSelectProps | null>(initSelectValue);

	useEffect(() => {
		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchNighthawkGreyList()));
	}, []);

	const initialValues = {
		type: EType.WEBSITE,
		url: initUrl,
		comment: ''
	};

	const formik = useFormik({
		initialValues,
		onSubmit: ({ url, comment }, { resetForm }) => {
			storeWithMiddleware
				.then(({ dispatch }) =>
					dispatch(
						addToTrustedList({
							type: selectedValue?.value as EType,
							url,
							comment,
							label: selectedValue?.label
						})
					)
				)
				.then(() => {
					storageService.removeTrustedListFromStorage();
					navigate(ROUTES.ADDED_TO_TRUSTED);
				});
			resetForm();
		},
		validationSchema: validationSchema()
	});

	const handleChange = (e: any) => {
		const changedValue: FormSelectProps = options.find((item) => item.value === e) || {
			label: 'Not found',
			value: 'not_found'
		};

		setSelectedValue(changedValue);
		setStep(2);

		formik.setFieldValue('url', '');
	};

	useEffect(() => {
		if (initSelectValue && currentStep !== 2) {
			setStep(2);
		}

		storeWithMiddleware
			// @ts-ignore
			.then(({ dispatch }) => dispatch(fetchNighthawkBlackList(selectedValue?.value)));
	}, [selectedValue?.value]);

	const { url } = formik.values;
	useEffect(() => {
		handleFormType(selectedValue?.value as EType, url, setSelectedValue);
	}, [url]);

	const isValidButton = !Object.keys(formik.errors).length && !!url && !customErrors;
	const greyListOptions = selectedValue?.value === EType.WEBSITE ? greyList : [];

	return (
		<PopupContainer>
			<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" mt="1rem" mb="1rem">
				Add To Your Trust List
			</GlobalTypography.Text>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<FormFieldContainer>
						<Select
							onChange={handleChange}
							value={selectedValue?.value}
							placeholder={'What are you adding?'}
							options={options}
						/>
					</FormFieldContainer>
					{currentStep === 2 && selectedValue?.value ? (
						<AddTrustListForm
							currentType={selectedValue?.value as EType}
							isValidButton={isValidButton}
							blackList={blackList}
							greyList={greyListOptions}
							onSetCustomErrors={setCustomErrors}
						/>
					) : null}
				</form>
			</FormikProvider>
		</PopupContainer>
	);
};

export default AddTrustedPage;
