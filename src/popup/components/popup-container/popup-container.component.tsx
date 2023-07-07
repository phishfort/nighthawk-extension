import React from 'react';
import TopLogo from '../common/logo/top-logo';
import BottomLogo from '../common/logo/bottom-logo';
import { MainContainer } from '../styled-components/main-container.styled';
import { Grid } from '@mui/material';
import MenuContent from '../menu/menu-content.component';

interface IPopupContainerProps {
	Container?: any;
	children?: React.ReactNode;
}

const PopupContainer: React.FC<IPopupContainerProps> = ({ Container = MainContainer, children }) => {
	return (
		<Container>
			<TopLogo menuContent={<MenuContent />}></TopLogo>
			<Grid container direction="column" alignItems="center" flexGrow={1}>
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child)) {
						return React.cloneElement(child, {});
					}
					return null;
				})}
			</Grid>
			<BottomLogo />
		</Container>
	);
};

export default PopupContainer;
