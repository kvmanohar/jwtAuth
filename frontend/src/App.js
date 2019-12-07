import React, { useState, useEffect } from 'react';
import { Router, navigate } from '@reach/router';

import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';
import Content from './components/Content';

export const userContext = React.createContext([]);

function App() {
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);

	const logOutCallBack = async () => {};

	useEffect(() => {}, []);

	return (
		<userContext.Provider value={[user, setUser]}>
			<div className="App">
				<Navigation logOutCallBack={logOutCallBack} />
				<Router id="router">
					<Login path="login" />
					<Register path="register" />
					<Protected path="protected" />
					<Content path="/" />
				</Router>
			</div>
		</userContext.Provider>
	);
}

export default App;
