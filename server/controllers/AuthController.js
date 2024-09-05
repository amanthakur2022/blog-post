const { success, error, validation } = require('../utils/responseApi');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');
const Verification = require('../models/Verification');

/**
 * @desc    Register a new user
 * @method  POST api/auth/register
 * @access  public
 */
const register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		// Check the user email
		if (user) return res.status(422).json(validation({ msg: 'Email already registered' }));

		const newUser = new User({
			username,
			email,
			password
		});

		// Save the user
		await newUser.save();

		// Save token for user to start verificating the account
		let verification = new Verification({
			token: uuidv4(),
			userId: newUser._id,
			type: 'Verify Registration'
		});

		// Save the verification data
		await verification.save();

		// Send the response to server
		res.status(201).json(
			success(
				'Register success, please activate your account.',
				{
					user: {
						id: newUser._id,
						name: newUser.name,
						email: newUser.email,
						verified: newUser.verified,
						verifiedAt: newUser.verifiedAt
					},
					verification
				},
				res.statusCode
			)
		);
	} catch (err) {
		res.status(500).json(error(err, res.statusCode));
	}
};

/**
 * @desc    Verify a new user
 * @method  GET api/auth/verify/:token
 * @access  public
 */
const verify = async (req, res) => {
	const { token } = req.params;

	try {
		let verification = await Verification.findOne({
			token,
			type: 'Verify Registration'
		});

		// Check the verification data
		if (!verification) return res.status(404).json(error('No verification data found', res.statusCode));

		// If verification data exists
		// Get the user data
		// And activate the account
		let user = await User.findOne({ _id: verification.userId }).select('-password');

		user = await User.findByIdAndUpdate(user._id, {
			$set: {
				verified: true,
				verifiedAt: new Date()
			}
		});

		// After user successfully verified
		// Remove the verification data from database
		verification = await Verification.findByIdAndDelete({ _id: verification._id });

		// Send the response
		return res.status(200).json(success('Your account verified Successfully', null, res.statusCode));
	} catch (err) {
		res.status(500).json(error(err, res.statusCode));
	}
};

/**
 * @desc    Login a user
 * @method  POST api/auth/login
 * @access  public
 */
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		// Check the email
		// If there's not exists
		// Throw the error
		if (!user) return res.status(422).json(validation('Invalid credentials'));

		//check if password is correct
		let checkPassword = await user.isPasswordMatch(password);
		if (!checkPassword) return res.status(422).json(validation('Invalid credentials'));

		// Check user if not activated yet
		// If not activated, send error response
		if (user && !user.verified)
			return res
				.status(400)
				.json(
					error('Your account is not activated yet. Please check your email to activate your account', res.statusCode)
				);

		// If the requirement above pass
		// Lets send the response with JWT token in it
		const payload = {
			user: {
				id: user._id,
				username: user.username,
				email: user.email
			}
		};

		//create token
		const token = await generateToken(payload);
		if (token) {
			res.cookie('Authorization', token, {
				httpOnly: true,
				secure: true
			});
		}
		return res.status(200).json(success('Login successfully', { token }, res.statusCode));
	} catch (err) {
		res.status(500).json(error(err.message, res.statusCode));
	}
};

/**
 * @desc    Resend new verification token to user
 * @method  POST api/auth/verify/resend
 * @access  public
 */
const resendVerification = async (req, res) => {
	const { email } = req.body;

	// Simple checking for email
	if (!email) return res.status(422).json(validation([{ msg: 'Email is required' }]));

	try {
		const user = await User.findOne({ email });

		// Check the user first
		if (!user) return res.status(404).json(error('Email not found', res.statusCode));

		// Check user if not activated yet
		// If not activated, send error response
		if (user && user.verified) return res.status(400).json(error('Your account is already activated.', res.statusCode));

		// If user exists
		// We gonna get data from verification by user ID
		let verification = await Verification.findOne({
			userId: user._id,
			type: 'Verify Registration'
		});

		// If there's verification data
		// Remove previous verification data and create a new one
		if (verification) {
			verification = await Verification.findByIdAndDelete(verification._id);
		}

		// Create a new verification data
		let newVerification = new Verification({
			token: uuidv4(),
			userId: user._id,
			type: 'Verify Registration'
		});

		// Save the verification data
		await newVerification.save();

		// Send the response
		res
			.status(201)
			.json(success('New Verification email has been sent', { verification: newVerification }, res.statusCode));
	} catch (err) {
		res.status(500).json(error(err, res.statusCode));
	}
};

/**
 * @desc    Get authenticated user
 * @method  GET api/auth
 * @access  private
 */
const getAuthenticatedUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		// Check the user just in case
		if (!user) return res.status(404).json(error('User not found', res.statusCode));

		// Send the response
		res.status(200).json(success(`Hello ${user.username}`, { user }, res.statusCode));
	} catch (err) {
		res.status(500).json(error(err.message, res.statusCode));
	}
};

const logoutUser = async (req, res, next) => {
	try {
		//reset token
		res.cookie('Authorization', '', {
			httpOnly: true,
			secure: true,
			expires: new Date(0)
		});
		return res.status(200).json(success(`User Logout Succesfully`, res.statusCode));
	} catch (err) {
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

// get all users
const getUsers = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.find(email, password).select('-password');

		// if no user exists
		if (user.length === 0) {
			return res.status(404).json(error('No user Exist', res.statusCode));
		}

		return res.status(200).json(success(`Fetched users Successfully`, { users: user }, res.statusCode));
	} catch (err) {
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

// get UserById
const getUserById = async (req, res) => {
	const userId = req.params.id;
	try {
		const findUser = await User.findById(userId).select('-password');
		return res.status(200).json(success(`Fetched user Successfully`, { user: findUser }, res.statusCode));
	} catch (err) {
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

// update UserById
const updateUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const { username } = req.body;

		const updateData = { username }; // Create an object with the field to be updated

		const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -email');
		return res.status(200).json(success(`Updated user Successfully`, { user: updateUser }, res.statusCode));
	} catch (err) {
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

// // delete UserById
const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const deleteUser = await User.findByIdAndDelete(userId, req.body);
		if (!deleteUser) {
			return res.status(404).json(error('No user exist with this id', res.statusCode));
		} else {
			return res.status(200).json(success(`User deleted Succesfully`, { user: null }, res.statusCode));
		}
	} catch (err) {
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

// get UserProfile
const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		// Check the user just in case
		if (!user) {
			return res.status(404).json(error('User not found', res.statusCode));
		} else {
			return res.status(200).json(success(`Fetched user profile Succesfully`, { user: user }, res.statusCode));
		}
	} catch (err) {
		console.log(err.message);
		return res.status(500).json(error(err.message, res.statusCode));
	}
};

module.exports = {
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
};
