import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage.js';

import Menu from './Menu.js';
import DetailPage from './DetailPage.js';
import './App.css';
import Navigation from './Navigation.js';
import Favorites from './Favorites.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import Cards from './Cards.js';
import Cards2 from './Cards2.js';
import Menu2 from './Menu2.js';
import AboutUs from './AboutUs.js';
import { Redirect } from 'react-router-dom';

const TOKEN_KEY = 'TOKEN';

export default class App extends Component {
	state = {
		token: localStorage.getItem(TOKEN_KEY) || '',
	};

	tokenToLocalStorage = (token) => {
		localStorage.setItem(TOKEN_KEY, token);
		this.setState({ token: token });
	};

	logout = () => {
		localStorage.clear();
		this.setState({ token: '' });
	};

	render() {
		return (
			<div>
				<Router>
					<Menu token={this.state.token} logout={this.logout} />
					<Switch>
						<Route
							path='/'
							exact
							render={(routerProps) => (
								<HomePage token={this.state.token} {...routerProps} />
							)}
						/>
						<Route
							path='/park/:parkCode'
							exact
							render={(routerProps) => (
								<DetailPage token={this.state.token} {...routerProps} />
							)}
						/>
						<Route
							path='/login'
							exact
							render={(routerProps) => (
								<LogIn
									tokenToLocalStorage={this.tokenToLocalStorage}
									{...routerProps}
								/>
							)}
						/>
						<Route
							path='/sign-up'
							exact
							render={(routerProps) => (
								<SignUp
									tokenToLocalStorage={this.tokenToLocalStorage}
									{...routerProps}
								/>
							)}
						/>
						<Route
							path='/favorites'
							exact
							render={(routerProps) =>
								this.state.token ? (
									<Favorites token={this.state.token} {...routerProps} />
								) : (
									<Redirect to='/' />
								)
							}
						/>
						<Route
							path='/aboutus'
							exact
							render={(routerProps) => <AboutUs {...routerProps} />}
						/>
						<Route
							path='/Cards'
							exact
							render={(routerProps) => <Cards {...routerProps} />}
						/>
						<Route
							path='/Cards2'
							exact
							render={(routerProps) => <Cards2 {...routerProps} />}
						/>
						<Route
							path='/Menu'
							exact
							render={(routerProps) => (
								<Menu
									token={this.state.token}
									logout={this.logout}
									{...routerProps}
								/>
							)}
						/>

						<Route
							path='/Menu2'
							exact
							render={(routerProps) => <Menu2 {...routerProps} />}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}
