//@ts-nocheck
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../event/store';
import { privateRoutes, publicRoutes } from './routes.utils';
import { getUserAuthInfo, selectIsVerified } from '../../features/store/auth';
import storeWithMiddleware from '../../../common/mockStore';
import { setRoutes } from '../../features/store/user';

interface NavigatorRoutesProp {}

const NavigatorRoutes: React.FC<NavigatorRoutesProp> = () => {
	const isVerified = useAppSelector(selectIsVerified);
	const dispatch = useAppDispatch();
	const { pathname } = useLocation();

	useEffect(() => {
		storeWithMiddleware
			// @ts-ignore
			.then(({ dispatch }) => dispatch(getUserAuthInfo()));
	}, []);

	useEffect(() => {
		dispatch(setRoutes(pathname));
	}, [pathname]);

	return (
		<Routes>
			{isVerified ? (
				<>
					{privateRoutes.map((route) => (
						<Route element={<route.component />} key={route.path} path={route.path} />
					))}
				</>
			) : (
				<>
					{publicRoutes.map((route) => (
						<Route element={<route.component />} path={route.path} />
					))}
				</>
			)}
		</Routes>
	);
};

export default NavigatorRoutes;
