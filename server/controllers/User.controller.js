const User = require('../models/User.model');
const { generateToken, getDataFromToken } = require('../utils/jwt');
const cookie = require('cookie');

// create users
const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		//check if user already exists
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ error: 'User already exists' });
		}

		const newUser = new User({
			username,
			email,
			password
		});

		const savedUser = await newUser.save();

		return res.status(201).json({ message: 'User Registered Succesfully' });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// login User
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		//check if user exists
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ error: '"User does not exist' });
		}

		//check if password is correct
		const validPassword = await user.isPasswordMatch(password);
		if (!validPassword) {
			return res.status(400).json({ error: 'Invalid password' });
		}

		//create token
		const token = await generateToken(user);
		if (token) {
			res.cookie('jwt-cookie', token, {
				httpOnly: true,
				secure: true
			});
		}

		return res.status(200).json({ message: 'User Login Succesfully' });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// logout User
const logoutUser = async (req, res) => {
	try {
		//reset token
		res.cookie('jwt-cookie', '', {
			httpOnly: true,
			secure: true,
			expires: new Date(0)
		});
		return res.status(200).json({ message: 'User Logout Succesfully' });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// get all users
const getUsers = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.find(email, password).select('-password');
		if (user.length === 0) {
			return res.status(400).json({ message: 'No user exist' });
		}
		return res.status(201).json({ users: user });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// get UserById
const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const findUser = await User.findById(userId).select('-password');
		if (!findUser) {
			return res.status(500).json({ error: 'No user exist with this id' });
		} else {
			return res.status(201).json({ user: findUser });
		}
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// get UserProfile
const getUserProfile = async (req, res) => {
	try {
		const userId = await getDataFromToken(req.headers.cookie);
		const getUser = await User.findById(userId).select('-password');
		if (!getUser) {
			return res.status(500).json({ error: 'No user exist with this id' });
		} else {
			return res.status(201).json({ user: getUser });
		}
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// update UserById
const updateUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const { username } = req.body;

		const updateData = { username }; // Create an object with the field to be updated

		const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -email');
		return res.status(201).json({ user: updateUser });
	} catch (err) {
		return res.status(500).json({ error: err.message });
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
		return res.status(500).json({ error: err.message });
	}
};

module.exports = {
	register,
	loginUser,
	logoutUser,
	getUsers,
	getUserProfile,
	getUserById,
	updateUserById,
	deleteUserById
};
