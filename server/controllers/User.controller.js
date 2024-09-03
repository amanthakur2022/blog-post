const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');
const cookie = require('cookie');

// create users
const register = async (req, res) => {
	try {
		const userExist = await User.findOne({ email: req.body.email });
		if (userExist) {
			return res.status(400).json({ error: 'User already exist' });
		} else {
			const user = await User.create(req.body);
			res.status(201).json({ message: 'User Registered Succesfully' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// login User
const loginUser = async (req, res) => {
	try {
		const user = req.body;

		const userExist = await User.findOne({ email: user.email });

		if (!userExist) {
			return res.status(400).json({ error: 'No user exist with email' });
		}
		const matchPass = await userExist.isPasswordMatch(req.body.password);
		if (!matchPass) {
			return res.status(400).json({ error: 'Wrong Password' });
		}

		const token = await generateToken(userExist);
		if (token) {
			res.cookie('jwt-cookie', token, {
				httpOnly: true,
				secure: true
			});
		}

		return res.status(200).json({ message: 'User Login Succesfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// get all users
const getUsers = async (req, res) => {
	try {
		const user = await User.find(req.body).select('-password');
		if (user.length === 0) {
			return res.status(400).json({ message: 'No user exist' });
		}
		res.status(201).json({ users: user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// get UserById
const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const findUser = await User.findById(userId).select('name email');
		if (!findUser) {
			return res.status(500).json({ error: 'No user exist with this id' });
		} else {
			return res.status(201).json({ user: findUser });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// update UserById
const updateUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const updateUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
		return res.status(201).json({ user: updateUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// // delete UserById
const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const deleteUser = await User.findByIdAndDelete(userId, req.body);
		if (!deleteUser) {
			return res.status(500).json({ error: 'No user exist with this id' });
		} else {
			return res.status(200).json({ message: 'User deleted Succesfully' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	register,
	loginUser,
	getUsers,
	getUserById,
	updateUserById,
	deleteUserById
};
