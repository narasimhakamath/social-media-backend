const express = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Notification = require('../models/notification');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/comments', authentication, async (req, res) => {
	if(!req['body']['commentID'] && !req['body']['postID'])
		return res.status(403).json({result: false, message: 'Invalid request payload.'});

	const comment = new Comment({
		comment: req['body']['comment'],
		postID: req['body']['postID'],
		userID: req['user']['_id']
	});

	const post = await Post.findById(req['body']['postID']);
	if(!post)
		res.status(400).json({result: false, message: 'Invalid post ID.'});

	const notificationData = {
		fromUserID: req['user']['_id'],
		toUserID: post['userID'],
		activityType: 'comment',
		parentActivity: 'post',
		parentActivitySourceID: req['body']['postID']
	}

	try {
		await comment.save();
		notificationData['activitySourceID'] = comment['_id'];
		await Notification.sendNotification(notificationData);
		res.status(201).json({result: true, message: 'Comment added successfully.', data: comment});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

// GET API to fetch the list of user comments on my posts.
router.get('/comments/recentComments', authentication, async (req, res) => {
	const userID = req['user']['_id'];

	const posts = await Post.find({userID}).select('_id');
	const postIDs = new Array();
	for(let post of posts) {
		postIDs.push(post['_id']);
	}

	const comments = await Comment.find({postID: {$in: postIDs}}).sort({createdAt: -1}).select('comment').populate('userID', '_id username name');
	if(!comments.length)
		return res.status(404).json({result: false, message: 'No comments found.'});
	res.status(200).json({result: true, message: 'Success.', data: comments});
});

router.get('/comments/recentComments/:postID', authentication, async (req, res) => {
	const postID = req['params']['postID'];

	const page = parseInt(req['query']['page'], 10) || 1;
	const limit = parseInt(req['query']['limit'], 10) || 100;
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