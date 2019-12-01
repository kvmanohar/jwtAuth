const { verify } = require('jsonwebtoken');

const isAuth = (req) => {
	const authorisation = req.headers['authorization'];
	if (!authorisation) throw new Error('You need to login');

	//'Bearer sjdklfjiekjfkdjoistq2t0ej'
	const token = authorisation.split(' ')[1];
	console.log(token);

	const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
	return userId;
};

module.exports = {
	isAuth
};
