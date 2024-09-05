const jwt = require('jsonwebtoken');
require('dotenv').config();
const { success, error, validation } = require('../utils/responseApi');

const generateToken = async (payload) => {
	const token = await jwt.sign(payload, process.env.JWT_KEY, {
		expiresIn: '1d'
	});
	return token;
};

/**
 * Get authenticated user data from JWT
 */
const getDataFromToken = async (req, res, next) => {
	const authorizationHeader = req.headers.cookie;
	if (!authorizationHeader) {
		return res.status(401).json(error('Unauthorized', res.statusCode));
	}

	// // Get the type of token and actual token
	const token = authorizationHeader.replace('Authorization=', '');

	// // Check the token
	if (!token) return res.status(404).json(error('No token found'));

	try {
		const jwtData = await jwt.verify(token, process.env.JWT_KEY);

		// Check the JWT token
		if (!jwtData) return res.status(401).json(error('Unauthorized', res.statusCode));

		// If is a valid token that JWT verify
		// Insert the data to the request
		req.user = jwtData.user;

		// Continue the action
		next();
	} catch (err) {
		res.status(500).json(error(err.message, res.statusCode));
	}
};

module.exports = { generateToken, getDataFromToken };
