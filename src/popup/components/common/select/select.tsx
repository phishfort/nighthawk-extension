import ReactSelect, { OnChangeValue, SingleValue } from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';
import { emotionStyles } from './styles';
import * as Styled from './styles';

export type Option<Value> = {
	value: Value;
	label: string;
};

type Nullable<Value> = Value | null | undefined;

export interface DefaultProps<Value, IsMulti extends boolean> {
	/**
	 * Optional container class name
	 */
	className?: string;

	style?: React.CSSProperties;

	/**
	 * Indicate component is in loading state
	 *
	 * @default false
	 */
	loading?: boolean;

	/**
	 * Indicate if component is disabled
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Indicates whether current input has an error
	 *
	 * @default false
	 */
	hasError?: boolean;

	/**
	 * Indicates if multiple items can be selected
	 *
	 * @default false
	 */
	multi?: IsMulti;

	/**
	 * Select options
	 *
	 * Currently, only supports list of options and does not support groups
	 */
	options: Option<Value>[];

	/**
	 * Currently selected value
	 */
	value?: IsMulti extends true ? Value[] : Value;

	/**
	 * Optional placeholder
	 */
	placeholder?: string;

	/**
	 * On change callback
	 */
	onChange?: (value: IsMulti extends true ? Value[] : Nullable<Value>) => void;

	/**
	 * On open callback
	 */
	onMenuOpen?: () => void;

	/**
	 * On close callback
	 */
	onMenuClose?: () => void;
}

interface SelectConstructor {
	<Value = string, IsMulti extends boolean = false>(
		props: DefaultProps<Value, IsMulti> & { creatable?: false }
	): JSX.Element;

	<Value = string, IsMulti extends boolean = false>(
		props: DefaultProps<Value, IsMulti> & { creatable: true } & {
			onCreate: (value: string) => void;
		}
	): JSX.Element;
}

export const Select: SelectConstructor = (props) => {
	const {
		className,
		style,
		loading,
		disabled,
		hasError,
		creatable,
		multi,
		options,
		value,
		placeholder,
		onChange = () => null,
		onMenuOpen = () => null,
		onMenuClose = () => null,
		...rest
	} = props;

	const Base = creatable ? ReactSelectCreatable : ReactSelect;

	const ifSingleValue = (checkValue: OnChangeValue<Option<any>, boolean>): checkValue is SingleValue<Option<any>> =>
		!Array.isArray(checkValue);

	const handleOnChange = (newValue: OnChangeValue<Option<any>, boolean>) => {
		/**
		 * In this case, using never is warranted as the component properties would be set to the proper value
		 */
		if (ifSingleValue(newValue)) {
			onChange(newValue?.value);
		} else {
			onChange(newValue.map((_) => _.value) as never);
		}
	};

	const handleValue = () => {
		if (value === null || value === undefined) {
			return null;
		}

		if (Array.isArray(value)) {
			return options.filter((_) => value.includes(_.value));
		}

		const singleValue = options.find((_) => value === _.value);
		if (!singleValue) {
			return null;
		}

		return singleValue;
	};

	const handleOnCreate = (newValue: string) => {
		if (creatable && props.onCreate) {
			props.onCreate(newValue);
		}
	};

	return (
		<Styled.SelectContainer>
			<Base
				{...rest}
				onMenuOpen={onMenuOpen}
				onMenuClose={onMenuClose}
				isLoading={loading}
				isMulti={multi}
				isDisabled={disabled}
				options={options}
				placeholder={placeholder}
				styles={emotionStyles<Option<any>, boolean>(hasError)}
				onChange={handleOnChange}
				value={handleValue()}
				onCreateOption={handleOnCreate}
				menuPortalTarget={document.body}
			/>
			<Styled.SelectArrow />
		</Styled.SelectContainer>
	);
};
