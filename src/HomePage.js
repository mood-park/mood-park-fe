import React, { useState, useEffect } from 'react';
import request from 'superagent';
// import { Link } from 'react-router-dom'
import { isFavorite } from './Utils.js';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Grid, Tooltip } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { removeFavorite } from './Utils.js';
import ButtonGroup from '@mui/material/ButtonGroup';
// import DetailPage from './DetailPage.js';
// import './HomePage.css';
import Spinner from './Spinner.js';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
// const URL = 'http://localhost:7890'

export default function HomePage({ token }) {
	// state = {
	// 	parks: [],
	// 	SearchPark: '',
	// 	favorites: [],
	// 	parkCode: '',

	// 	start: 0,
	// 	isLoading: false,
	// };
	const [parks, setParks] = useState([]);
	const [searchPark, setSearchPark] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [parkCode, setParkCode] = useState('');
	const [start, setStart] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const submitPark = async (e) => {
		e.preventDefault();
		const response = await request.get(`${URL}/park?q=${searchPark}`);
		// this.setState({ parks: response.body.data });
		setParks(response.body.data);
	};

	const handleSearch = async (e) => {
		// this.setState({ SearchPark: e.target.value });
		setSearchPark(e.target.value);
	};

	const handleRemove = async (parkCode) => {
		// const token = this.props.token;
		await removeFavorite(parkCode, token);
		const favs = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		// this.setState({ favorites: favs.body });
		setFavorites(favs.body);
	};

	const handleFavorite = async (park) => {
		// const token = this.props.token;
		await request
			.post(`${URL}/api/favorites`)
			.send(park)
			.set('Authorization', token);
		const favs = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		// this.setState({ favorites: favs.body });
		setFavorites(favs.body);
	};

	useEffect(() => {
		const getParks = async () => {
			// componentDidMount = async () => {
			// this.setState({ isLoading: true });
			setIsLoading(true);
			// const token = this.props.token;
			const response = await request.get(
				// `${URL}/parks?start=${this.state.start}`
				`${URL}/parks?start=${start}`
			);
			if (token) {
				const favs = await request
					.get(`${URL}/api/favorites`)
					.set('Authorization', token);
				// this.setState({ favorites: favs.body });
				setFavorites(favs.body);
			}
			// this.setState({ parks: response.body.data, isLoading: false });
			setParks(response.body.data);
			setIsLoading(false);
		};
		getParks();
	}, [start, token]);

	const nextTwenty = () => {
		// await this.setState({ start: this.state.start + 20 });
		setStart(start + 20);
		// this.componentDidMount();
		// await getParks();
	};

	const previousTwenty = () => {
		// await this.setState({ start: this.state.start - 20 });
		setStart(start - 20);
		// this.componentDidMount();
		// await getParks();
	};

	const firstTwenty = () => {
		// await this.setState({ start: (this.state.start = 0) });
		setStart(0);
		// this.componentDidMount();
		// await getParks();
	};

	return (
		<React.Fragment>
			<Grid
				container
				direction='column'
				justifyContent='top'
				alignItems='center'
			>
				<section className='home-page-head'>
					<h1>Parks 4ME</h1>
					<p>
						Parks 4ME helps you plan your next National Park adventure.
						<br />
						Browse through the comprehensive list of parks and historical sites.
						<br />
						See details about each park, and reviews that others have shared.
						<br />
						<b>
							Sign up for an account to bookmark your favorite National Parks
							and share your park reviews with others.
						</b>
					</p>
				</section>
				<div>
					<ButtonGroup style={{ marginBottom: '10px' }}>
						<Button
							variant='contained'
							className='change-results'
							onClick={firstTwenty}
							disabled={start < 20}
						>
							First 20
						</Button>
						<Button
							variant='contained'
							className='change-results'
							onClick={previousTwenty}
							disabled={start < 20}
						>
							Previous 20
						</Button>
						<Button
							variant='contained'
							className='change-results'
							onClick={nextTwenty}
							disabled={parks.length < 20}
						>
							Next 20
						</Button>
					</ButtonGroup>
					<form onSubmit={submitPark}>
						<label>
							<TextField
								id='outlined-basic'
								label='Search By Name'
								size='small'
								variant='outlined'
								type='text'
								required
								onChange={handleSearch}
							/>
						</label>
						<Button type='submit' variant='contained'>
							{' '}
							Find Park{' '}
						</Button>
					</form>
				</div>
				<div>
					<br />
					{isLoading ? (
						<Spinner />
					) : (
						<Grid
							container
							direction='row'
							justifyContent='space-evenly'
							alignItems='top'
						>
							{parks.map((park) => (
								<Card
									key={park.parkCode}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										flexDirection: 'column',
										marginBottom: '10px',
										marginTop: '10px',
									}}
									sx={{ maxWidth: 345 }}
								>
									<CardActionArea href={`/park/${park.parkCode}`}>
										<CardMedia
											component='img'
											height='140'
											image={park.images[0].url}
											alt={park.fullname}
										/>
										<CardContent>
											<Typography gutterBottom variant='h5' component='div'>
												{park.fullName}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												{park.description}
											</Typography>
										</CardContent>
										{/* <div style = {{height: 100}}></div> */}
									</CardActionArea>
									{token && (
										<CardActions>
											<Tooltip title='Add/Remove Favorites' placement='right'>
												{isFavorite(park, favorites) ? (
													<IconButton
														size='large'
														color='error'
														aria-label='add to favorites'
														onClick={() => handleRemove(park.parkCode)}
													>
														{/* <FavoriteIcon /> */}
													</IconButton>
												) : (
													<IconButton
														size='large'
														aria-label='add to favorites'
														onClick={() => handleFavorite(park)}
													>
														{/* <FavoriteIcon /> */}
													</IconButton>
												)}
											</Tooltip>
										</CardActions>
									)}
								</Card>
							))}
						</Grid>
					)}
				</div>
			</Grid>
		</React.Fragment>
	);
}
