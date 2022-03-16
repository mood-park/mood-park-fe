import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage.js';
import Menu from './Menu.js';
import DetailPage2 from './DetailPage2.js';
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
import Menu3 from './Menu3.js';

const TOKEN_KEY = 'TOKEN';

export default function App() {
	const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
	// state = {
	// 	token: localStorage.getItem(TOKEN_KEY) || '',
	// };

	const tokenToLocalStorage = (token) => {
		localStorage.setItem(TOKEN_KEY, token);
		setToken(token);
	};

	const logout = () => {
		localStorage.clear();
		setToken('');
	};
	return (
		<div>
			<Router>
				{/* <Navigation token={this.state.token} logout={this.logout} /> */}
				<Menu3 token={token} logout={logout} />
				<Switch>
					<Route
						path='/'
						exact
						render={(routerProps) => (
							<HomePage token={token} {...routerProps} />
						)}
					/>
					<Route
						path='/park/:parkCode'
						exact
						render={(routerProps) => (
							<DetailPage2 token={token} {...routerProps} />
						)}
					/>
					<Route
						path='/login'
						exact
						render={(routerProps) => (
							<LogIn
								tokenToLocalStorage={tokenToLocalStorage}
								{...routerProps}
							/>
						)}
					/>
					<Route
						path='/sign-up'
						exact
						render={(routerProps) => (
							<SignUp
								tokenToLocalStorage={tokenToLocalStorage}
								{...routerProps}
							/>
						)}
					/>
					<Route
						path='/favorites'
						exact
						render={(routerProps) =>
							this.state.token ? (
								<Favorites token={token} {...routerProps} />
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
							<Menu {...routerProps} token={token} logout={logout} />
						)}
					/>

					<Route
						path='/Menu2'
						exact
						render={(routerProps) => <Menu2 {...routerProps} />}
					/>
					{/* <Route
							path='/Menu3'
							exact
							render={(routerProps) => <Menu3 {...routerProps} />}
						/> */}
				</Switch>
			</Router>
		</div>
	);
}
