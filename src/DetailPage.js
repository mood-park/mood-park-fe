import React, { useState } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { InputLabel } from '@material-ui/core';
import './DetailPage.css';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
//  const URL = 'http://localhost:7890'

export default function DetailPage({match, token}) {
	const [parkCode, setParkCode] = useState('');
	const [park, setPark] = useState(
		{
			images: [{ url: '' }],
			activities: [{ name: '' }],
			entranceFees: [{ cost: '' }],
			operatingHours: [{ standardHours: { monday: '' } }],
		}
	)
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

	const fetchPark = async () => { 
	// componentDidMount = async () => {
		const parkCode = match.params.parkCode;
		const response = await request.get(URL + `/parkDetail/${parkCode}`);

		setPark(response.body.data[0])
		
		setParkCode(parkCode);


		
		if (token) {
			const comments = await request
				.get(URL + `/api/comments/${parkCode}`)
				.set('Authorization', token);
			setComments(comments.body);
			

			// const userId = await request.get(URL + '/api/user').set('Authorization', token);
			// console.log(userId)
			const userID = localStorage.getItem('USER_ID');
			setUserId(userID);
		}
	};
	useEffect(() => {
	  fetchPark()
	}, [])
	

	handleFavorite = async () => {
		const response = await request
			.post(`${URL}/api/favorites`)
			.send(this.state.park)
			.set('Authorization', token);
		return response.body.data;
	};

	handleCommentSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;

		await request
			.post(`${URL}/api/comments`)
			// .send({ comment: this.state.comment, parkcode: this.state.parkCode })
			.send({comment, parkcode: parkCode})
			.set('Authorization', token);

		// this.componentDidMount();
		//We need to await fetchPark here because it's async.  even though
		// we don't await it inside the useeffect
		await fetchPark()
	};

	const handlePostEdit = async (commentId) => {
		// const comment = this.state.comments.find(
			const currentComment = comments.find(
			(comment) => commentId === comment.id
		);
		// this.setState({
		// 	comment: comment.comment,
		// 	editing: true,
		// 	commentId: commentId,
		// });

		setComment(currentComment.comment);
		setEditing(true);
		setCommentId(commentId);
	};

	handleEditSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;
		await request
			.put(`${URL}/api/comments/${this.state.commentId}`)
			.send({ comment: this.state.comment })
			.set('Authorization', token);

		this.setState({ editing: false });
		this.componentDidMount();
	};

	render() {
		return (
			<div
				className='detail-page'
				style={{
					backgroundImage: `url(${this.state.park.images[0].url})`,
					resizeMode: `cover`,
				}}
			>
				{/* park title and add fav button */}
				<div className='detail-head'>
					<h1>{this.state.park.name}</h1>
					{/* {this.props.token &&<button onClick={this.handleFavorite}>Favorite</button>} */}
				</div>

				{/* park details */}
				<section className='park-detail'>
					<section>
						<div>{this.state.park.description}</div>
					</section>
					<section>
						<div>
							<b>Activities:</b>
							{this.state.park.activities.map((activity) => (
								<div>{activity.name}</div>
							))}
						</div>
					</section>
					<section>
						<div>
							<b>State:</b> {this.state.park.states}
						</div>
						<div>
							<b>Hours:</b>{' '}
							{this.state.park.operatingHours[0].standardHours.monday}
						</div>
						<div>
							<b>Park Fee:</b> ${this.state.park.entranceFees[0].cost}
						</div>
						<div>
							<a href={this.state.park.url}>{this.state.park.url}</a>
						</div>
					</section>
				</section>

				{/* comments section */}
				<div>
					{this.props.token && (
						<form
							onSubmit={
								this.state.editing
									? this.handleEditSubmit
									: this.handleCommentSubmit
							}
						>
							<InputLabel htmlFor='my-input'>Post Comment Below</InputLabel>
							<TextField
								fullWidth={true}
								multiline={true}
								rows={4}
								label='Comment'
								id='Comment'
								variant='outlined'
								value={this.state.comment}
								onChange={(e) => this.setState({ comment: e.target.value })}
							/>
							{this.state.editing ? (
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
					{this.state.comments
						.sort((a, b) => b.park_timestamp - a.park_timestamp)
						.map((comment) => {
							return (
								<div className='comments'>
									{comment.comment} <br />
									{new Date(
										Number(comment.park_timestamp)
									).toLocaleDateString()}
									<div className='user'>User {comment.owner_id} </div>
									{console.log(comment.owner_id, this.state.userId)}
									{comment.owner_id === Number(this.state.userId) && (
										<button onClick={() => this.handlePostEdit(comment.id)}>
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
}
