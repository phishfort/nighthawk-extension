/* eslint-disable jsx-a11y/control-has-associated-label */
import * as Styled from './hexagon-points.styled';

interface IProps {
	/**
	 * A title that is shown inside of a field
	 */
	title?: string;
}

const HexagonPoints: React.FC<IProps> = ({ title = '0' }) => {
	const { length } = title;

	return (
		<Styled.HexagonContainer length={length}>
			<span className="title">{title && title}</span>
		</Styled.HexagonContainer>
	);
};
export default HexagonPoints;
