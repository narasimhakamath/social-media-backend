const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6
	},
	token: {
		type: String,
		trim: true
	}
}, {
	timestamps: true
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userID'
});

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'userID'
});

userSchema.methods.generateAuthenticationToken = async function() {
	const user = this;
	const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
	user.token = token;
	await user.save();
	return token;
}

userSchema.pre('save', async function(next) {
	if(this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8);
	}
	next();
});

userSchema.statics.isUsernameExists = async(username) => {
	const userData = await User.findOne({username});
	if(userData)
		throw new Error('Username already exists.');
}

userSchema.statics.findByCredentials = async(username, password) => {
	const user = await User.findOne({username});
	if(!user)
		throw new Error('Invalid credentials.');

	const isMatch = await bcrypt.compare(password, user['password']);
	if(!isMatch)
		throw new Error(`Unable to login.`);

	return user;
}

userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
}

const User = mongoose.model('User', userSchema);
module.exports = User;