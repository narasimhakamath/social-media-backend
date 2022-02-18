const express = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/comments', authentication, async (req, res) => {
	const comment = new Comment({
		comment: req['body']['comment'],
		postID: req['body']['postID'],
		userID: req['user']['_id']
	});

	const post = await Post.findById(req['body']['postID']);
	if(!post)
		res.status(400).json({result: false, message: 'Invalid post ID.'});

	try {
		await comment.save();
		res.status(201).json({result: true, message: 'Comment added successfully.', data: comment});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

module.exports = router;