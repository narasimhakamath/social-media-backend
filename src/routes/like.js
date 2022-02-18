const express = require('express');
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/likes', authentication, async (req, res) => {
	const postID = req['body']['postID'] || null;
	const commentID = req['body']['commentID'] || null;

	let existingLike = null;
	const iData = {userID: req['user']['_id']};
	if(req['body']['postID']) {
		const post = await Post.findById(req['body']['postID']);
		if(!post)
			res.status(400).json({result: false, message: 'Invalid post ID.'});
		existingLike = await Like.findOne({postID: req['body']['postID'], userID: req['user']['_id']});
		iData['postID'] = req['body']['postID'];
	} else {
		const comment = await Comment.findById(req['body']['commentID']);
		if(!comment)
			res.status(400).json({result: false, message: 'Invalid comment ID.'});
		existingLike = await Like.findOne({commentID: req['body']['commentID'], userID: req['user']['_id']});
		iData['commentID'] = req['body']['commentID'];
	}

	if(existingLike)
		res.status(400).json({result: false, message: "Liked has been added already."});

	try {
		const like = new Like(iData);
		await new Like(iData).save();
		res.status(201).json({result: true, message: 'Like added successfully.', data: like});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

module.exports = router;