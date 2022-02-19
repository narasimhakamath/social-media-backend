const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	fromUserID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	toUserID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	message: {
		type: String,
		required: true,
		trim: true
	},
	activityType: {
		type: String,
		enum: ['likes', 'comments']
	},
	activitySourceID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	isViewed: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

notificationSchema.methods.toJSON = function() {
	const notification = this;
	const notificationObject = notification.toObject();
	return notificationObject;
}

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;