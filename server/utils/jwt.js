const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user) => {
	const token = await jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
		expiresIn: '1d'
	});
	return token;
};

const getDataFromToken = async (user) => {
	const token = user?.replace('jwt-cookie=', '');
	const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
	return decodedToken.userId;
};

module.exports = { generateToken, getDataFromToken };
