const express = require('express');
const { getDataFromToken } = require('../utils/jwt');
const {
	register,
	verify,
	login,
	resendVerification,
	getAuthenticatedUser,
	logoutUser,
	getUsers,
	getUserById,
	updateUserById,
	deleteUserById,
	getUserProfile
} = require('../controllers/AuthController');

const router = express.Router();

router.route('/register').post(register);

router.get('/verify/:token', verify);

router.post('/login', login);

router.post('/verify/resend', resendVerification);

router.get('/', getDataFromToken, getAuthenticatedUser);

router.route('/logout').post(logoutUser);

router.route('/users').get(getUsers);

router.route('/user/:id').get(getUserById);

router.get('/profile', getDataFromToken, getUserProfile);

router.route('/user/:id').put(updateUserById);

router.route('/user/:id').delete(deleteUserById);

module.exports = router;
