require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const { fakeDB } = require('../src/fakeDB');
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

server.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
