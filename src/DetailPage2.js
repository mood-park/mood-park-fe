import React, { Component } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { InputLabel } from '@material-ui/core';
import './DetailPage.css';
import { Container, Typography } from '@mui/material';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
//  const URL = 'http://localhost:7890'

export default class DetailPage extends Component {
	state = {
		parkCode: '',
		park: {
			images: [{ url: '' }],
			activities: [{ name: '' }],
			entranceFees: [{ cost: '' }],
			operatingHours: [{ standardHours: { monday: '' } }],
		},
		comment: '',
		comments: [],
		userId: '',
		editing: false,
		commentId: '',
	};

	componentDidMount = async () => {
		const parkCode = this.props.match.params.parkCode;
		const response = await request.get(URL + `/parkDetail/${parkCode}`);
		console.log(response.body.data[0]);
		this.setState({ park: response.body.data[0], parkCode: parkCode });

		const token = this.props.token;
		if (token) {
			const comments = await request
				.get(URL + `/api/comments/${parkCode}`)
				.set('Authorization', token);
			this.setState({ comments: comments.body });
			console.log(comments.body);

			// const userId = await request.get(URL + '/api/user').set('Authorization', token);
			// console.log(userId)
			const userID = localStorage.getItem('USER_ID');
			this.setState({ userId: userID });
		}
	};

	handleFavorite = async () => {
		const token = this.props.token;
		const response = await request
			.post(`${URL}/api/favorites`)
			.send(this.state.park)
			.set('Authorization', token);
		return response.body.data;
	};

	handleCommentSubmit = async (e) => {
		e.preventDefault();
		const token = this.props.token;

		await request
			.post(`${URL}/api/comments`)
			.send({ comment: this.state.comment, parkcode: this.state.parkCode })
			.set('Authorization', token);

		this.componentDidMount();
	};

	handlePostEdit = async (commentId) => {
		const comment = this.state.comments.find(
			(comment) => commentId === comment.id
		);
		this.setState({
			comment: comment.comment,
			editing: true,
			commentId: commentId,
		});
	};

	handleEditSubmit = async (e) => {
		e.preventDefault();
		const token = this.props.token;
		await request
			.put(`${URL}/api/comments/${this.state.commentId}`)
			.send({ comment: this.state.comment })
			.set('Authorization', token);

		this.setState({ editing: false });
		this.componentDidMount();
	};

	render() {
		return (
			<Box
				/*className='detail-page'*/
				style={{
					backgroundImage: `url(${this.state.park.images[0].url})`,
					backgroundSize: `cover`,
				}}
			>
				{/* park title and add fav button */}
				<Box className='detail-head'>
					<Typography variant='h1'>{this.state.park.name}</Typography>
					{/* {this.props.token &&<button onClick={this.handleFavorite}>Favorite</button>} */}
				</Box>

				{/* park details */}
				<section className='park-detail'>
					<Box>
						<Container maxWidth='sm'>
							<Typography>{this.state.park.description}</Typography>
						</Container>

						<Box>
							<Container>
								<b>Activities:</b>
								{this.state.park.activities.map((activity) => (
									<div>{activity.name}</div>
								))}
							</Container>
						</Box>
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
					</Box>
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
								<Box className='comments'>
									'{comment.comment}'' <br />
									<Typography
										style={{ fontSize: '.8rem', fontStyle: 'Italic' }}
									>
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
									{console.log(comment.owner_id, this.state.userId)}
									{comment.owner_id === Number(this.state.userId) && (
										<Button
											size='small'
											onClick={() => this.handlePostEdit(comment.id)}
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
}
