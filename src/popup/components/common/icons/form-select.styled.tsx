import React from 'react';
import styled from 'styled-components';
import Select from '@mui/material/Select';
import { TiArrowSortedDown } from 'react-icons/ti';
import BigBorder from '../../../../assets/icons/input-big-border.svg';
import BigBorderError from '../../../../assets/icons/input-big-border-error.svg';
import { COLORS, FONTS, SPACES } from '../../../../common/constants';

const ArrowIcon: React.FC<any> = React.forwardRef((props, ref) => (
	<TiArrowSortedDown size={24} color={COLORS.deepViolet} style={{ marginRight: '9px' }} {...props} ref={ref} />
));

const StandardSelect = React.forwardRef((props, ref) => (
	<Select variant="standard" disableUnderline IconComponent={ArrowIcon} {...props} ref={ref} />
));

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const SelectContainer = styled.div<{ disabled?: boolean | undefined; error?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	background-repeat: no-repeat;
	min-height: 50px;
	margin: ${SPACES.xxxs};
	background-image: ${(props) => (props.error ? `url(${BigBorderError})` : `url(${BigBorder})`)};
	min-width: 440px;
`;

export const SelectField = styled(StandardSelect)`
	background-color: transparent;
	margin-left: -24px;
	min-width: 405px;
	min-height: 45px;
	padding: ${SPACES.xxxs};
	cursor: pointer;
	& .MuiSelect-select {
		padding-left: 15px;
	}
`;

export const Option = styled.option`
	padding: ${SPACES.l};
	font-size: ${FONTS.SIZES.l};
	font-family: ${FONTS.FAMILIES.ibmPlexSans};
	color: ${COLORS.blackOlive};
`;

export const Label = styled.div<{ isDark?: boolean }>`
	display: flex;
	font-size: ${FONTS.SIZES.m};
	font-family: ${FONTS.FAMILIES.ibmPlexSans};
	font-weight: ${FONTS.WEIGHTS.medium};
	position: relative;
	top: 5px;
	align-self: flex-start;
	margin-left: ${SPACES.xxxxl};
	color: ${({ isDark }) => (isDark ? COLORS.white : COLORS.black)};
`;

export const SubLabel = styled.div`
	display: flex;
	font-style: italic;
	position: relative;
	font-size: ${FONTS.SIZES.s};
	font-family: ${FONTS.FAMILIES.ibmPlexSans};
	position: relative;
	top: 7.5px;
	color: ${COLORS.paleDarkGrey};
	font-weight: ${FONTS.WEIGHTS.normal};
`;

export const Wrapper = styled.div`
	width: 100%;
	position: relative;
	flex-direction: row;
	display: flex;
`;
export const Labels = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-right: ${SPACES.xxxxxxl};
`;

export const Styled = {
	SelectContainer,
	Select,
	Container,
	Label,
	Option,
	SelectField,
	SubLabel,
	Wrapper,
	Labels
};
