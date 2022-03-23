import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router-dom';
import Link from '@mui/material/Link';

const pages = ['Home', 'Login', 'Signup', 'About Us'];

const Menu3 = ({ logout, token }) => {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const history = useHistory();

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleFavoriteNav = () => {
		history.push('/favorites');
	};

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
					>
						Parks4Me
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{/* {pages.map((page) => ( */}

							<MenuItem onClick={handleCloseNavMenu}>
								<Typography textAlign='center'>
									<Link href={'/'} underline='none'>
										HOME
									</Link>
								</Typography>
							</MenuItem>
							{!token && (
								<MenuItem onClick={handleCloseNavMenu}>
									<Typography textAlign='center'>
										<Link href={'/login'} underline='none'>
											SIGN IN
										</Link>
									</Typography>
								</MenuItem>
							)}
							{!token && (
								<MenuItem onClick={handleCloseNavMenu}>
									<Typography textAlign='center'>
										<Link href={'/sign-up'} underline='none'>
											SIGN UP
										</Link>
									</Typography>
								</MenuItem>
							)}
							<MenuItem onClick={handleCloseNavMenu}>
								<Typography textAlign='center'>
									<Link href={'/aboutus'} underline='none'>
										ABOUT US
									</Link>
								</Typography>
							</MenuItem>
							{/* ))} */}
						</Menu>
					</Box>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
					>
						Parks4Me
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{/* {pages.map((page) => ( */}
						<Button
							href={'/'}
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'flex' }}
						>
							<MenuItem onClick={handleCloseNavMenu}>
								<Typography textAlign='center'>HOME</Typography>
							</MenuItem>
						</Button>
						{!token && (
							<Button
								href={'/login'}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: 'white', display: 'flex' }}
							>
								<MenuItem onClick={handleCloseNavMenu}>
									<Typography textAlign='center'>SIGN IN</Typography>
								</MenuItem>
							</Button>
						)}
						{!token && (
							<Button
								href={'/sign-up'}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: 'white', display: 'flex' }}
							>
								<MenuItem onClick={handleCloseNavMenu}>
									<Typography textAlign='center'>SIGN UP</Typography>
								</MenuItem>
							</Button>
						)}
						<Button
							href={'/aboutus'}
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'flex' }}
						>
							<MenuItem onClick={handleCloseNavMenu}>
								<Typography textAlign='center'>ABOUT US</Typography>
							</MenuItem>
							{/* {page} */}
						</Button>
						{/* ))} */}
					</Box>
					{token && (
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title='Open settings'>
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar
										alt='Park with sunglight'
										src='https://images.unsplash.com/photo-1568480289356-5a75d0fd47fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
									/>
								</IconButton>
							</Tooltip>

							<Menu
								sx={{ mt: '45px' }}
								id='menu-appbar'
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem onClick={handleCloseUserMenu}>
									<Typography onClick={handleFavoriteNav} textAlign='center'>
										Favorites
									</Typography>
								</MenuItem>
								<MenuItem onClick={handleCloseUserMenu}>
									<Typography onClick={logout} textAlign='center'>
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Menu3;
