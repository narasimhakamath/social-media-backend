const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/users/signup', async (req, res) => {
	const isUsernameExists = await User.isUsernameExists(req.body.username);

	const user = new User({
		name: req['body']['name'],
		username: req['body']['username'],
		password: req['body']['password'],
	});

	try {
		await user.save();
		res.status(201).json({result: true, message: 'Account created successfully.'});
	} catch(error) {
		res.status(400).json({result: false, message: 'Invalid request.', error});
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials()
	}
});