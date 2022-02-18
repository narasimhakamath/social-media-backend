const express = require('express');
const Post = require('../models/post');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/posts', authentication, async (req, res) => {
	const post = new Post({
		title: req['body']['title'],
		content: req['body']['content'],
		userID: req['user']['_id']
	});

	try {
		await post.save();
		res.status(201).json({result: true, message: 'Post created successfully.', data: post});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

module.exports = router;