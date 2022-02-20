const express = require('express');
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Notification = require('../models/notification');

const authentication = require('../middlewares/authentication');

const router = express.Router();

router.post('/likes', authentication, async (req, res) => {
	const userID = req['user']['_id'];

	if(!req['body']['postID'] && !req['body']['commentID'])
		return res.status(403).json({result: false, message: 'Invalid request payload.'});

	let existingLike = null;
	let toUserID = null;

	const notificationData = {
		fromUserID: userID,
		activityType: 'like'
	}

	const iData = {userID};
	if(req['body']['postID']) {
		const post = await Post.findById(req['body']['postID']);
		if(!post)
			return res.status(400).json({result: false, message: 'Invalid post ID.'});
		toUserID = post['userID'];

		iData['postID'] = req['body']['postID'];
		notificationData['parentActivity'] = 'post';
		notificationData['parentActivitySourceID'] = req['body']['postID'];
		existingLike = await Like.findOne({postID: req['body']['postID'], userID});
	} else if(req['body']['commentID']) {
		const comment = await Comment.findById(req['body']['commentID']);
		if(!comment)
			return res.status(400).json({result: false, message: 'Invalid comment ID.'});
		toUserID = comment['userID'];

		iData['commentID'] = req['body']['commentID'];
		notificationData['parentActivity'] = 'comment';
		notificationData['parentActivitySourceID'] = req['body']['commentID'];
		existingLike = await Like.findOne({commentID: req['body']['commentID'], userID});
	}

	if(existingLike)
		return res.status(400).json({result: false, message: "Liked has been added already."});

	notificationData['toUserID'] = toUserID;

	try {
		const like = new Like(iData);
		await new Like(iData).save();
		notificationData['activitySourceID'] = like['_id'].toString();
		Notification.sendNotification(notificationData);
		res.status(201).json({result: true, message: 'Like added successfully.', data: like});
	} catch(e) {
		res.status(400).json({result: false, message: e.message});
	}
});

router.get('/likes/:entity/:entityID', authentication, async (req, res) => {
	const entity = req['params']['entity'];
	const supportedEntities = ['post', 'comment'];
	if(!supportedEntities.includes(entity))
		return res.status(400).json({result: false, message: 'Invalid request.'});

	const page = parseInt(req['query']['page'], 10) || 1;
	const limit = parseInt(req['query']['limit'], 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const entityID = req['params']['entityID'];
	let queryCondition = new Object();
	if(entity === 'post') {
		queryCondition['postID'] = entityID;
	} else if(entity === 'comment') {
		queryCondition['commentID'] = entityID;
	}

	const total = await Like.countDocuments(queryCondition);
	const pagination = new Object();
	if(startIndex > 0)
		pagination['previousPage'] = page - 1;
	if(endIndex < total)
		pagination['nextPage'] = page + 1;

	const likes = await Like.find(queryCondition)
		.select('_id')
		.sort({createdAt: -1})
		.skip(startIndex)
		.limit(limit)
		.populate('userID', 'name');

	const likesData = new Array();
	for(let like of likes) {
		likesData.push({userID: like['userID']['_id'], name: like['userID']['name']});
	}

	res.status(200).json({result: true, message: 'Fetching data successfully.', data: likesData, pagination, total});
});

// router.get('/likes/getMyLikedComments', authentication, async(req, res) => {
// 	const likes = await Like
// 		.find({commentID: {$ne: null}})
// 		.select('_id')
// 		.sort({createdAt: -1})
// 		.populate({path: 'commentID', select: 'comment userID', match: {userID: req['user']['_id']}})
// 		.populate({path: 'userID', select: 'name'});

// 	const likesData = new Array();
// 	for(let like of likes) {
// 		if(like['commentID']) {
// 			likesData.push({
// 				_id: like['_id'],
// 				comment: like['commentID']['comment'],
// 				likedByUserID: like['userID']['_id'],
// 				likedByUser: like['userID']['name'],
// 			});
// 		}
// 	}

// 	res.status(200).json({result: true, message: 'Fetching data successfully.', data: likesData});
// });

// GET API to fetch the latest list of users liking my posts.
router.get('/likes/recentLikes', authentication, async (req, res) => {
	const userID = req['user']['_id'];

	const posts = await Post.find({userID}).select('_id');
	const postIDs = new Array();
	for(let post of posts) {
		postIDs.push(post['_id']);
	}

	const likes = await Like.find({postID: {$in: postIDs}, userID: {$nin: userID}}).sort({createdAt: -1}).populate('postID', 'title').populate('userID', 'username name');
	if(!likes.length)
		return res.status(404).json({result: false, message: 'No likes found.'});

	const likesData = new Array();
	for(let like of likes) {
		likesData.push({
			_id: like['_id'],
			postID: like['postID']['_id'],
			postTitle: like['postID']['title'],
			postTitle: like['postID']['title'],
			userID: like['userID']['_id'],
			userName: like['userID']['name']
		});
	}

	res.status(200).json({result: true, message: 'Success.', data: likesData});
});

// API to fetch the list of comments/users who liked my comments on any post.
router.get('/likes/myLikedComments', authentication, async (req, res) => {
	const userID = req['user']['_id'];

	const comments = await Comment.find({userID}).select('_id');
	const commentIDs = new Array();
	for(let comment of comments) {
		commentIDs.push(comment['_id']);
	}

	const likes = await Like.find({commentID: {$in: commentIDs}, userID: {$nin: userID}}).sort({createdAt: -1}).populate('commentID', 'comment').populate('userID', 'username name');
	if(!likes.length)
		return res.status(404).json({result: false, message: 'No likes found.'});

	const likesData = new Array();
	for(let like of likes) {
		likesData.push({
			_id: like['_id'],
			commentID: like['commentID']['_id'],
			comment: like['commentID']['comment'],
			userID: like['userID']['_id'],
			userName: like['userID']['name']
		});
	}

	return res.status(200).json({result: true, message: 'Success.', data: likesData});
});

module.exports = router;