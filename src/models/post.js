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
}, {
	timestamps: true
});

postSchema.methods.toJSON = function() {
	const post = this;
	const postObject = post.toObject();
	return postObject;
}

const Post = mongoose.model('Post', postSchema);
module.exports = Post;