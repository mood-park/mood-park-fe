import React, { useState, useEffect } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { InputLabel } from '@material-ui/core';
import Paper from '@mui/material/Paper';
// import './DetailPage.css';
import { Container, Typography } from '@mui/material';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
//  const URL = 'http://localhost:7890'

export default function DetailPage({ match, token }) {
	const [park, setPark] = useState({
		images: [{ url: '' }],
		activities: [{ name: '' }],
		entranceFees: [{ cost: '' }],
		operatingHours: [{ standardHours: { monday: '' } }],
	});
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [userId, setUserId] = useState('');
	const [editing, setEditing] = useState(false);
	const [commentId, setCommentId] = useState('');

	// state = {
	// 	parkCode: '',
	// 	park: {
	// 		images: [{ url: '' }],
	// 		activities: [{ name: '' }],
	// 		entranceFees: [{ cost: '' }],
	// 		operatingHours: [{ standardHours: { monday: '' } }],
	// 	},
	// 	comment: '',
	// 	comments: [],
	// 	userId: '',
	// 	editing: false,
	// 	commentId: '',
	// };

	//Component did mount, lifecycle method for class based components.  so instead
	//we are going to take this logic and putting it in a new function inside a useEffect
	// componentDidMount = async () => {
	const parkCode = match.params.parkCode;

	const fetchPark = async () => {
		const response = await request.get(`${URL}/parkDetail/${parkCode}`);
		// console.log(response.body.data[0]);
		setPark(response.body.data[0]);
		//Don't need because we are bringing in Token as props above.
		// const token = this.props.token;
		if (token) {
			const comments = await request
				.get(`${URL}/api/comments/${parkCode}`)
				.set('Authorization', token);
			setComments(comments.body);

			// const userId = await request.get(URL + '/api/user').set('Authorization', token);
			// console.log(userId)
			const userID = localStorage.getItem('USER_ID');
			setUserId(userID);
		}
	};

	useEffect(() => {
		fetchPark();
	}, []);

	const handleFavorite = async () => {
		// const token = this.props.token;
		await request
			.post(`${URL}/api/favorites`)
			.send(park)
			.set('Authorization', token);
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;

		await request
			.post(`${URL}/api/comments`)
			.send({ comment, parkcode: parkCode })
			.set('Authorization', token);

		await fetchPark();
	};

	const handlePostEdit = async (commentId) => {
		const comment = comments.find((comment) => commentId === comment.id);
		// this.setState({
		// 	comment: comment.comment,
		// 	editing: true,
		// 	commentId: commentId,
		// });

		setComment(comment.comment);
		setEditing(true);
		setCommentId(commentId);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;
		await request
			.put(`${URL}/api/comments/${commentId}`)
			.send({ comment })
			.set('Authorization', token);

		setEditing(false);
		await fetchPark();
	};

	return (
		<Box
			/*className='detail-page'*/
			style={{
				backgroundImage: `url(${park.images[0].url})`,
				backgroundSize: `cover`,
				height: '100vh',
			}}
		>
			{/* park title and add fav button */}
			<Box className='detail-head'>
				<Typography variant='h1'>{park.name}</Typography>
				{/* {this.props.token &&<button onClick={this.handleFavorite}>Favorite</button>} */}
			</Box>

			{/* park details */}
			{/* <section className='park-detail'> */}
			<Box>
				<Container maxWidth='sm'>
					<Typography>{park.description}</Typography>
				</Container>

				<Box>
					<Container>
						<b>Activities:</b>
						{park.activities.map((activity) => (
							<div>{activity.name}</div>
						))}
					</Container>
				</Box>

				<div>
					<b>State:</b> {park.states}
				</div>
				<div>
					<b>Hours:</b> {park.operatingHours[0].standardHours.monday}
				</div>
				<div>
					<b>Park Fee:</b> ${park.entranceFees[0].cost}
				</div>
				<div>
					<a href={park.url}>{park.url}</a>
				</div>
			</Box>
			{/* </section> */}

			{/* comments section */}
			<Box>
				{token && (
					<form onSubmit={editing ? handleEditSubmit : handleCommentSubmit}>
						<Paper elevation={3}>
							<InputLabel htmlFor='my-input' style={{ color: 'white' }}>
								Post Comment Below:
							</InputLabel>
							<TextField
								fullWidth={true}
								multiline={true}
								rows={4}
								label='Comment'
								id='Comment'
								variant='outlined'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
							{editing ? (
								<Button variant='contained' type='submit'>
									Edit
								</Button>
							) : (
								<Button variant='contained' type='submit'>
									Post
								</Button>
							)}
						</Paper>
					</form>
				)}
			</Box>
			<section>
				{comments
					.sort((a, b) => b.park_timestamp - a.park_timestamp)
					.map((comment) => {
						return (
							<Box className='comments'>
								'{comment.comment}'' <br />
								<Typography style={{ fontSize: '.8rem', fontStyle: 'Italic' }}>
									{new Date(
										Number(comment.park_timestamp)
									).toLocaleDateString()}
								</Typography>
								<Typography
									style={{ fontSize: '.7rem', fontStyle: 'Italic' }}
									className='user'
								>
									User {comment.owner_id}{' '}
								</Typography>
								{console.log(comment.owner_id, userId)}
								{comment.owner_id === Number(userId) && (
									<Button
										size='small'
										onClick={() => handlePostEdit(comment.id)}
									>
										Edit post
									</Button>
								)}
							</Box>
						);
					})}
			</section>
		</Box>
	);
}
