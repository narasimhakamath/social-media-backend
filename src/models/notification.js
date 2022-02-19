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
	activityType: {
		type: String,
		enum: ['like', 'comment'],
		required: true
	},
	activitySourceID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	parentActivity: {
		type: String,
		enum: ['comment', 'post'],
		required: true
	},
	parentActivitySourceID: {
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

notificationSchema.statics.sendNotification = async (notificationData) => {
	if(notificationData['fromUserID'].toString() === notificationData['toUserID'].toString())
		return false;

	let isProceed = false;
	if(notificationData['activityType'] === 'like') {
		if(notificationData['parentActivity'] === 'comment') {
			isProceed = true;
		} else if(notificationData['parentActivity'] === 'post') {
			isProceed = true;
		}
	} else if(notificationData['activityType'] === 'comment') {
		if(notificationData['parentActivity'] === 'post') {
			isProceed = true;
		}
	}

	if(!isProceed)
		return false;

	const notification = new Notification(notificationData);
	notification.save();
}

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;