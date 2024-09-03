const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user) => {
	const token = await jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
		expiresIn: '1d'
	});
	return token;
};

const getDataFromToken = async (user) => {
	try {
		const token = user.cookies.get('jwt-cookie')?.value || '';
		const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
		return decodedToken.id;
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {generateToken, getDataFromToken};
