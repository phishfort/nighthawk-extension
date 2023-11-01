//@ts-nocheck
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { FormSelectProps } from '../../components/common/form-field-container/types';
import { Select } from '../../components/common/select/select';
import PopupContainer from '../../components/popup-container/popup-container.component';
import useStep from '../../hooks/useStepHook';
import ScamReportForm from './components/scam-report-second-step';
import * as GlobalTypography from '../../components/common/global-typography';
import { Grid } from '@mui/material';
import { FormFieldContainer } from '../../components/common/form-field-container';
import storeWithMiddleware from '../../../common/mockStore';
import { ROUTES } from '../../components/navigator/routes.utils';
import { validationSchema } from './utils';
import { addToScam, addToScamGuest, selectIsScamLoading } from '../../features/store/scam';
import { useAppSelector } from '../../../event/store';
import { selectIsVerified } from '../../features/store/auth';
import { EType } from '../../../api/types';
import { getActiveTab } from '../../../content/features/store/source/sourceSlice';
import { SOC_MEDIA } from '../../../common/constants/app-keys.const';
import {
	fetchNighthawkBlackList,
	fetchNighthawkGreyList,
	fetchNighthawkWhiteList,
	selectBlackList,
	selectGreyList,
	selectWhiteList
} from '../../features/store/trusted-list';
import { handleFormType, options } from '../../utils';
import { fetchUserInfo, selectUserInfo } from '../../features/store/user';
import { IUserInfo } from '../../../api/types/profile.types';

const MAX_STEPS = 2;

const SaveFormikState = ({ selectedType }) => {
	const { values } = useFormikContext();
	const activeTab = useAppSelector(getActiveTab);
	useEffect(() => {
		const savedFormValues = { ...values, type: selectedType };
		localStorage.setItem('scamFormValues' + activeTab, JSON.stringify(savedFormValues));
	}, [values, selectedType, activeTab]);

	return null;
};

const ScamReportPage: React.FC = () => {
	const navigate = useNavigate();
	const userInfo: IUserInfo = useAppSelector(selectUserInfo);
	const isVerified = useAppSelector(selectIsVerified);
	const isScamLoading = useAppSelector(selectIsScamLoading);
	const activeTab = useAppSelector(getActiveTab);
	const whiteList = useAppSelector(selectWhiteList);
	const greyList = useAppSelector(selectGreyList);
	const blackList = useAppSelector(selectBlackList);
	const [customErrors, setCustomErrors] = useState<boolean>(false);
	const [currentStep, { canGoToNextStep, reset, setStep }] = useStep(MAX_STEPS);
	const fromStore = localStorage.getItem('scamFormValues' + activeTab);
	const [savedFormValues, setSavedFormValues] = useState<any>(JSON.parse(fromStore));

	const isNotWebsite = !activeTab?.includes('http') || Object.values(SOC_MEDIA).some((el) => activeTab?.includes(el));
	const initUrl = isNotWebsite ? '' : activeTab;

	const initSelectValue = isNotWebsite
		? null
		: {
				label: 'Website',
				value: EType.WEBSITE
		  };
	const [selectedValue, setSelectedValue] = React.useState<FormSelectProps | null>(initSelectValue);
	const type = selectedValue?.value as EType;

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
		if (savedFormValues?.type) {
			const typeSelected = options.find((_) => _.value === savedFormValues?.type);
			setSelectedValue(typeSelected);
		}

		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchUserInfo()));
		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchNighthawkGreyList()));
	}, []);

	useEffect(() => {
		if (initSelectValue && currentStep !== 2) {
			setStep(2);
		}

		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchNighthawkWhiteList(type)));
		storeWithMiddleware.then(({ dispatch }) => dispatch(fetchNighthawkBlackList(type)));
	}, [type]);

	const initialValues = {
		type: EType.WEBSITE,
		url: initUrl,
		impersonatedUrl: '',
		comment: ''
	};

	const formik = useFormik({
		initialValues: savedFormValues ? savedFormValues : initialValues,
		onSubmit: ({ url, impersonatedUrl, comment }, { resetForm }) => {
			storeWithMiddleware
				.then(({ dispatch }) =>
					dispatch(
						(isVerified ? addToScam : addToScamGuest)({
							type,
							url,
							impersonatedUrl,
							userId: userInfo?.id,
							comment,
							label: selectedValue?.label
						})
					)
				)
				.then(() => {
					localStorage.removeItem('scamFormValues-' + activeTab);
					navigate(ROUTES.ADDED_TO_SCAM);
				});
			resetForm();
		},
		validationSchema: validationSchema(true)
	});

	const { url } = formik.values;
	useEffect(() => {
		handleFormType(type, url, setSelectedValue);
	}, [url]);

	const whiteListOptions = whiteList.map((el) => el.url);
	const greyListOptions = type === EType.WEBSITE ? greyList : [];
	const isValidButton = !Object.keys(formik.errors).length && !!url && !customErrors;

	return (
		<PopupContainer>
			<Grid container direction="column" alignItems="center" justifyContent="center">
				<GlobalTypography.Text variant="subtitle1" colorVariant="common.white" fontWeight="fontWeightBold" mb="1rem">
					Report a Scam
				</GlobalTypography.Text>

				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit}>
						<FormFieldContainer>
							<Select
								onChange={handleChange}
								value={selectedValue?.value}
								placeholder={'What are you reporting?'}
								options={options}
							/>
						</FormFieldContainer>
						{selectedValue?.value ? (
							<ScamReportForm
								currentType={type}
								isValidButton={isValidButton}
								passedOptions={whiteListOptions}
								blackList={blackList}
								greyList={greyListOptions}
								onSetCustomErrors={setCustomErrors}
								whiteList={whiteList}
								isLoading={isScamLoading}
							/>
						) : null}
					</form>
					<SaveFormikState selectedType={selectedValue?.value} />
				</FormikProvider>
			</Grid>
		</PopupContainer>
	);
};

export default ScamReportPage;
