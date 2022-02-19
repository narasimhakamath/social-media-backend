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

router.get('/comments/:postID', authentication, async (req, res) => {
	const postID = req['params']['postID'];

	const page = parseInt(req['query']['page'], 10) || 1;
	const limit = parseInt(req['query']['limit'], 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const queryCondition = {postID};

	const total = await Comment.countDocuments(queryCondition);
	const pagination = new Object();
	if(startIndex > 0)
		pagination['previousPage'] = page - 1;
	if(endIndex < total)
		pagination['nextPage'] = page + 1;

	const comments = await Comment.find(queryCondition)
		.select('_id comment')
		.sort({createdAt: -1})
		.skip(startIndex)
		.limit(limit)
		.populate('userID', 'name');

	const commentsData = new Array();
	for(let comment of comments) {
		commentsData.push({
			commentID: comment['_id'],
			comment: comment['comment'],
			userID: comment['userID']['_id'],
			name: comment['userID']['name']
		});
	}

	res.status(200).json({result: true, message: 'Fetching data successfully.', data: commentsData, pagination, total});
});

module.exports = router;