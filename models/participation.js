
var mongoose = require('mongoose');

module.exports = mongoose.model('Participation',{
	user_id: String,
	joined_at: String,
	group_id: String
});