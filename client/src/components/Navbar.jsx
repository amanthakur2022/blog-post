import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Collapse, Typography, Button, IconButton, Input } from '@material-tailwind/react';

export function Header() {
	const [openNav, setOpenNav] = useState(false);
	const pathname = useLocation().pathname;

	useEffect(() => {
		window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false));
	}, []);

	const navList = (
		<ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
			<div className="relative w-full gap-2 md:w-max">
				<Input
					type="search"
					placeholder="Search"
					containerProps={{
						className: 'min-w-[288px]'
					}}
					className=" !border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
					labelProps={{
						className: 'before:content-none after:content-none'
					}}
				/>
				<div className="!absolute left-3 top-[13px]">
					<svg width="13" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeWidth="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</svg>
				</div>
			</div>
			<Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal ">
				<Link to="/" className={`flex items-center ${pathname === '/' ? 'text-blue-500' : ''}`}>
					Home
				</Link>
			</Typography>
			<Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
				<Link to="/about" className={`flex items-center ${pathname === '/about' ? 'text-blue-500' : ''}`}>
					About
				</Link>
			</Typography>
			<Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
				<Link to="/#" className={`flex items-center ${pathname === '/#' ? 'text-blue-500' : ''}`}>
					Projects
				</Link>
			</Typography>

			<IconButton variant="text" className="rounded-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
					/>
				</svg>
				{/* <svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
					/>
				</svg> */}
			</IconButton>
		</ul>
	);

	return (
		<div className="max-h-[768px]">
			<Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
				<div className="flex items-center justify-between text-blue-gray-900">
					<Link to="/" className="mr-4 cursor-pointer py-1.5 font-bold">
						Mern Blog
					</Link>
					<div className="flex items-center gap-4">
						<div className="mr-4 hidden lg:block">{navList}</div>
						<div className="flex items-center gap-x-1">
							<Link to="signin">
								<Button variant="gradient" size="sm" className="hidden lg:inline-block">
									<span>Log In</span>
								</Button>
							</Link>
						</div>
						<IconButton
							variant="text"
							className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
							ripple={false}
							onClick={() => setOpenNav(!openNav)}
						>
							{openNav ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									className="h-6 w-6"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</IconButton>
					</div>
				</div>
				<Collapse open={openNav}>
					{navList}
					<div className="flex items-center gap-x-1">
						<Link to="signin">
							<Button fullWidth variant="gradient" size="sm" className="">
								<span>Log In</span>
							</Button>
						</Link>
					</div>
				</Collapse>
			</Navbar>
		</div>
	);
}
