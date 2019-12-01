require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const { fakeDB } = require('../src/fakeDB');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require(`./tokens`);
//1. Register a user
//2. Login a user
//3. Logout a user
//4. Setup a potected route
//5. Get a new accesstoken with a refresh token

const server = express();

//Use express middleware for eaiser cookie handler.
server.use(cookieParser());
server.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
);

//Needed to be able to read body data
server.use(express.json()); //to support JSON-encoded bodies.
server.use(express.urlencoded({ extended: true })); //to support URL-encoded bodies.

//1. Register a user
server.post('/register', async (req, res) => {
	const { email, password } = req.body;

	try {
		//1.Check if user exists
		const user = fakeDB.find((user) => user.email === email);
		if (user) throw new Error('User already exists');

		//2. If not user exits, hash the password
		const hashedPassword = await hash(password, 10);

		//3.Insert the user to the Database
		fakeDB.push({
			id: fakeDB.length,
			email,
			password: hashedPassword
		});

		res.send({ message: 'User created' });
		console.log(fakeDB);
	} catch (err) {
		res.send({ error: `${err.message}` });
	}
});

//2.Login a user
server.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		//1.Find user in the DB, if not exists send error
		const user = fakeDB.find((user) => user.email === email);
		if (!user) throw new Error('User does not exists');

		//2. Compare crypted password and see if it matches
		const valid = await compare(password, user.password);
		if (!valid) throw new Error('Password not correct');

		//3.Create refresh and access tokens
		const accesstoken = createAccessToken(user.id);
		const refreshToken = createRefreshToken(user.id);

		//4.Put the referesh token in the DB
		user.refreshToken = refreshToken;
		console.log(fakeDB);

		//5.Send token- Refresh token as cookie and access token as a regular response
		sendRefreshToken(res, refreshToken);
		sendAccessToken(res, req, accesstoken);
	} catch (err) {
		res.send({ error: `${err.message}` });
	}
});

server.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
