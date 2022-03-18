import React, { useState, useEffect } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { InputLabel } from '@material-ui/core';
import './DetailPage.css';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
//  const URL = 'http://localhost:7890'

export default function DetailPage({ match, token }) {
	//We are removing this because park code never changes over time, no need for state.
	//const [parkCode, setParkCode] = useState('');
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

	//MOVED this out of the function below to make it global:
	const parkCode = match.params.parkCode;

	const fetchPark = async () => {
		// componentDidMount = async () => {
		const response = await request.get(`${URL}/parkDetail/${parkCode}`);
		//
		setPark(response.body.data[0]);

		//setParkCode(parkCode);

		if (token) {
			const response = await request
				.get(`${URL}/api/comments/${parkCode}`)
				.set('Authorization', token);

			setComments(response.body);

			// const userId = await request.get(URL + '/api/user').set('Authorization', token);
			// console.log(userId)
			const userID = localStorage.getItem('USER_ID');
			setUserId(userID);
		}
	};
	useEffect(() => {
		fetchPark();
	}, [comments]);

	// const handleFavorite = async () => {
	// 	//don't really need to save response, not returning anything:
	// 	//const response = await request
	// 	await request
	// 		.post(`${URL}/api/favorites`)
	// 		//.send(this.state.park)
	// 		.send(park)
	// 		.set('Authorization', token);
	// 	//we aren't actually returning anything here:
	// 	//return response.body.data;
	// };

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;

		await request
			.post(`${URL}/api/comments`)
			// .send({ comment: this.state.comment, parkcode: this.state.parkCode })
			.send({ comment, parkcode: parkCode })
			.set('Authorization', token);

		// this.componentDidMount();
		//We need to await fetchPark here because it's async.  even though
		// we don't await it inside the useeffect
		//we are only calling this to get the most current comments:
		//await fetchPark()
	};

	const handleCommentEdit = async (commentId) => {
		// const comment = this.state.comments.find(
		const currentComment = comments.find((comment) => commentId === comment.id);
		// this.setState({
		// 	comment: comment.comment,
		// 	editing: true,
		// 	commentId: commentId,
		// });

		setComment(currentComment.comment);
		setEditing(true);
		setCommentId(commentId);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;
		await request
			.put(`${URL}/api/comments/${commentId}`)
			//.send({ comment: this.state.comment })
			.send(comment)
			.set('Authorization', token);

		//this.setState({ editing: false });
		setEditing(false);
		//We don't need this line anymore because we fetch comments in the useffect
		//await fetchPark();
	};

	return (
		<div
			className='detail-page'
			style={{
				backgroundImage: `url(${park.images[0].url})`,
				resizeMode: `cover`,
			}}
		>
			{/* park title and add fav button */}
			<div className='detail-head'>
				<h1>{park.name}</h1>
				{/* {this.props.token &&<button onClick={this.handleFavorite}>Favorite</button>} */}
			</div>

			{/* park details */}
			<section className='park-detail'>
				<section>
					<div>{park.description}</div>
				</section>
				<section>
					<div>
						<b>Activities:</b>
						{park.activities.map((activity) => (
							<div>{activity.name}</div>
						))}
					</div>
				</section>
				<section>
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
				</section>
			</section>

			{/* comments section */}
			<div>
				{token && (
					<form onSubmit={editing ? handleEditSubmit : handleCommentSubmit}>
						<InputLabel htmlFor='my-input'>Post Comment Below</InputLabel>
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
					</form>
				)}
			</div>
			<section>
				{comments
					.sort((a, b) => b.park_timestamp - a.park_timestamp)
					.map((comment) => {
						return (
							<div className='comments'>
								{comment.comment} <br />
								{new Date(Number(comment.park_timestamp)).toLocaleDateString()}
								<div className='user'>User {comment.owner_id} </div>
								{comment.owner_id === Number(userId) && (
									<button onClick={() => handleCommentEdit(comment.id)}>
										Edit post
									</button>
								)}
							</div>
						);
					})}
			</section>
		</div>
	);
}
