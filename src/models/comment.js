const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	commentText: {
		type: String,
		required: true,
		trim: true
	},
	postID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Post',
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	isActive: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

commentSchema.methods.toJSON = function() {
	const comment = this;
	const commentObject = comment.toObject();
	return commentObject;
}

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;