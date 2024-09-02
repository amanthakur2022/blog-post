import { Typography } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';

export function Footer() {
	const pathname = useLocation().pathname;
	return (
		<footer className="flex w-full flex-row flex-wrap items-center shadow-sm px-9 justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
			<Typography color="blue-gray" className="font-normal">
				&copy; 2024 Mern Blog
			</Typography>
			<ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
				<Link to="/" className={`font-normal text-sm ${pathname === '/' ? 'text-blue-500' : ''}`}>
					Home
				</Link>
				<Link to="/about" className={`font-normal text-sm 0 ${pathname === '/about' ? 'text-blue-500' : ''}`}>
					About us
				</Link>
				<Link to="/projects" className={`font-normal text-sm ${pathname === '/projects' ? 'text-blue-500' : ''}`}>
					Projects
				</Link>
			</ul>
		</footer>
	);
}
