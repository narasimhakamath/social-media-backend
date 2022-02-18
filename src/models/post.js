const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	content: {
		type: String,
		required: true
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
});

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postID'
});

postSchema.methods.toJSON = function() {
	const post = this;
	const postObject = post.toObject();
	return postObject;
}

const Post = mongoose.model('Post', postSchema);
module.exports = Post;