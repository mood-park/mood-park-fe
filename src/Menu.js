import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';

export default function BasicMenu() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Toolbar>
					<Button
						id='basic-button'
						aria-controls='basic-menu'
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
						color='inherit'
					>
						MENU
					</Button>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem onClick={handleClose}>
							<Link href='/' underline='none'>
								Home
							</Link>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<Link href='favorites' underline='none'>
								Favorites
							</Link>
						</MenuItem>
						{}
						<MenuItem onClick={handleClose}>
							<Link href='sign-up' underline='none'>
								Sign Up
							</Link>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<Link href='login' underline='none'>
								Sign In
							</Link>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<Link href='aboutus' underline='none'>
								About Us
							</Link>
						</MenuItem>
						{/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
					</Menu>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
