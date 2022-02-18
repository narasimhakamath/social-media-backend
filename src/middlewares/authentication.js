const jwt = require('jsonwebtoken');

const User = require('../models/user');

const authentication = async (req, res, next) => {
	try {
		const token = request.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({_id, decoded._id, token: token});
		if(!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch(e) {
		console.log(e.message);
		res.status(401).json({result: false, message: 'Authentication required.'});
	}
}

module.exports = authentication;