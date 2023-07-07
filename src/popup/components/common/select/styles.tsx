import { GroupBase, mergeStyles } from 'react-select';
import { COLORS } from '../../../../common/constants';
import styled from '@emotion/styled';
import { TiArrowSortedDown } from 'react-icons/ti';
import React from 'react';
import { Theme } from '@mui/material';

export const SelectContainer = styled.div`
	position: relative;
`;

const ArrowIcon: React.FC<any> = React.forwardRef((props, ref) => <TiArrowSortedDown size={24} {...props} ref={ref} />);

export const SelectArrow = styled(ArrowIcon)<{ theme?: Theme }>`
	position: absolute;
	top: 12px;
	right: 10px;
	color: ${({ theme }) => theme.palette.primary.main};
`;

const styles = {
	fontSize: '14px',
	textColor: `black`,
	textColorDisabled: 'gray',
	backgroundColor: 'white',
	borderColor: 'black',
	borderHover: 'black',
	danger: 'red',
	backgroundColorDisabled: 'gray'
};

export function emotionStyles<Option = unknown, IsMulti extends boolean = false>(hasError = false) {
	return mergeStyles<Option, IsMulti, GroupBase<Option>>({
		control: (_) => ({
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			boxSizing: 'border-box',
			width: '230px',
			transition: 'all 0.3s',
			height: 45,
			outline: 0,
			cursor: 'pointer',
			'&:hover': {
				borderColor: styles.borderHover
			},
			fontFamily: 'IBM Plex Sans',
			fontWeight: 300,
			fontSize: 14,
			zIndex: 100,
			marginLeft: 10
		}),

		placeholder: (_) => ({
			..._,
			padding: 0,
			fontSize: styles.fontSize,
			color: 'black',
			userSelect: 'none'
		}),
		singleValue: (_, { isDisabled }) => ({
			..._,
			color: isDisabled ? styles.textColorDisabled : styles.textColor,
			fontSize: styles.fontSize
		}),

		input: (_) => ({
			..._,
			margin: 0,
			fontSize: styles.fontSize,
			color: 'black'
		}),
		indicatorsContainer: (_) => ({ ..._, padding: 0 }),
		clearIndicator: (_) => ({ ..._, padding: 0 }),
		dropdownIndicator: (_) => ({
			..._,
			padding: 0,
			width: 32,
			color: 'transparent',
			zIndex: 150,
			':hover': {
				color: 'transparent'
			}
		}),
		indicatorSeparator: (_) => ({
			..._,
			backgroundColor: 'transparent'
		}),
		valueContainer: (_) => ({
			..._,
			userSelect: 'none',
			padding: 0
		}),
		menu: (_) => ({
			..._,
			width: '236px',
			borderRadius: 0,
			border: 0,
			outline: 0,
			left: -11,
			top: -10,
			zIndex: 100
		}),
		noOptionsMessage: (_) => ({
			..._,
			fontSize: styles.fontSize
		}),
		option: (_) => ({
			..._,
			fontWeight: 400,
			lineHeight: 1.125,
			letterSpacing: '-0.01em',
			fontSize: styles.fontSize,
			color: 'black',
			zIndex: 100,
			cursor: 'pointer'
		}),
		menuPortal: (_) => ({
			..._,
			zIndex: 9999
		})
	});
}
