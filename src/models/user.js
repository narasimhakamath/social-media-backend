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
	}
}, {
	timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;