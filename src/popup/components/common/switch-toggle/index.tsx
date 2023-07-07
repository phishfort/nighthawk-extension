/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, ChangeEvent, useEffect } from 'react';
import { Slider, ToggleContainer, ToggleLabel } from './switch-toggle.styled';

interface ISwitchToggle {
	isChecked?: boolean;
	withLabel?: boolean;
	color?: string;
	onChange?: Function;
}

export const SwitchToggle: React.FC<ISwitchToggle> = ({ isChecked, withLabel = false, color, onChange }) => {
	const [checked, setChecked] = useState(isChecked);
	const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
		const { checked: nowChecked } = e.target;
		setChecked(nowChecked);
		if (onChange) onChange(nowChecked);
	};

	useEffect(() => {
		setChecked(isChecked);
	}, [isChecked]);

	return (
		<ToggleContainer color={color}>
			<label>
				<input type="checkbox" checked={checked} onChange={handleCheck} />
				<Slider color={color} />
			</label>
			{withLabel && <ToggleLabel color={color}>{checked ? 'On' : 'Off'}</ToggleLabel>}
		</ToggleContainer>
	);
};
