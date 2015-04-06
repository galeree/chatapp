
var mongoose = require('mongoose');

module.exports = mongoose.model('Message',{
	user_id: String,
	group_id: String,
	content: String,
	created_at: Date
});