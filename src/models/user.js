const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jwt');

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
	avatar: {
		type: Buffer
	},
	active: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

userSchema.pre('save', async function(next) {
	if(this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8);
	}
	next();
});

userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
}

const User = mongoose.model('User', userSchema);
module.exports = User;