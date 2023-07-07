import { ROUTES } from '../navigator/routes.utils';
import { NavLinkTemplate } from '../styled-components/nav-link-template.styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../event/store';
import { getActiveTab, getSourceType } from '../../../content/features/store/source/sourceSlice';
import { AiOutlineClose } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { getInitRoute } from '../../utils';

const MenuContent = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const activeTab = useAppSelector(getActiveTab);
	const sourceType = useAppSelector(getSourceType);

	const initRoute = getInitRoute(activeTab, sourceType);

	const handleClose = () => {
		navigate(initRoute);
	};

	return (
		<>
			{pathname === ROUTES.MAIN_PAGE ? (
				<AiOutlineClose size={23} cursor="pointer" onClick={handleClose} />
			) : (
				<NavLinkTemplate to={ROUTES.MAIN_PAGE}>
					<GiHamburgerMenu size={20} cursor="pointer" />
				</NavLinkTemplate>
			)}
		</>
	);
};

export default MenuContent;
