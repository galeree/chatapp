
var mongoose = require('mongoose');

module.exports = mongoose.model('Group',{
	name: String,
	owner_id: String,
	created_at: Date
});