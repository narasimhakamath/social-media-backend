const express = require('express');
const User = require('../models/user');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/users/signup', async (req, res) => {
	try {
		await User.isUsernameExists(req.body.username);

		const user = new User({
			name: req['body']['name'],
			username: req['body']['username'],
			password: req['body']['password'],
		});
		await user.save();
		const token = await user.generateAuthenticationToken();
		res.status(201).json({result: true, message: 'Account created successfully.', token});
	} catch(error) {
		res.status(400).json({result: false, message: error.message});
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.username, req.body.password);
		const token = await user.generateAuthenticationToken();
		res.status(200).json({result: true, message: 'Logged in successfully.', token});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

router.get('/users/me', authentication, async(req, res) => {
	res.status(200).json({result: true, message: 'Fetching user data.', data: req['user']});
});

module.exports = router;