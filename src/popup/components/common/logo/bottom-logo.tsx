import React, { ReactNode } from 'react';
import { BottomLogoContainer } from './logo.styled';
import { PoweredByPhishfort } from '../../../../common/icons/powered-by-phishfort';

interface IBottomLogoProps {
	children?: ReactNode;
}

const BottomLogo: React.FC<IBottomLogoProps> = ({ children }) => {
	return (
		<BottomLogoContainer>
			<PoweredByPhishfort />
			{/* logo should be svg format. PhishFortLogo is svg react component. use it  */}
			{/* <PhishFortLogo width={width} height={height} /> */}
			{children}
		</BottomLogoContainer>
	);
};

export default BottomLogo;
