import React from 'react';
import { SVGTypeProps } from './types';

const CrossIcon: React.FC<SVGTypeProps> = ({ height = 12, width = 12, onClick }) => {
	return (
		<svg
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			x="0"
			y="0"
			enableBackground="new 0 0 94.926 94.926"
			version="1.1"
			viewBox="0 0 94.926 94.926"
			xmlSpace="preserve"
			onClick={onClick}
		>
			<path d="M55.931 47.463L94.306 9.09a2.118 2.118 0 000-2.994L88.833.62a2.123 2.123 0 00-2.996 0L47.463 38.994 9.089.62c-.795-.795-2.202-.794-2.995 0L.622 6.096a2.117 2.117 0 000 2.994l38.374 38.373L.622 85.836a2.117 2.117 0 000 2.994l5.473 5.476a2.123 2.123 0 002.995 0l38.374-38.374 38.374 38.374c.397.396.937.62 1.498.62s1.101-.224 1.498-.62l5.473-5.476a2.118 2.118 0 000-2.994L55.931 47.463z"></path>
		</svg>
	);
};

export default CrossIcon;
