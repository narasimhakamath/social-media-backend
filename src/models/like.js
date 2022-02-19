const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
	postID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	},
	commentID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
});

likeSchema.index({postID: 1, commentID: 1, userID: 1}, {unique: true});

likeSchema.methods.toJSON = function() {
	const like = this;
	const likeObject = like.toObject();
	return likeObject;
}

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;