const express = require('express');
const {
	register,
	loginUser,
	logoutUser,
	getUsers,
	getUserProfile,
	getUserById,
	updateUserById,
	deleteUserById
} = require('../controllers/User.controller');

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(loginUser);

router.route('/logout').post(logoutUser);

router.route('/users').get(getUsers);

router.route('/user/profile').get(getUserProfile);

router.route('/user/:id').get(getUserById);

router.route('/user/:id').put(updateUserById);

router.route('/user/:id').delete(deleteUserById);

module.exports = router;
