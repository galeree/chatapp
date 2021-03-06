var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Group = require('./group');
var User = require('./user');

var messageSchema = new Schema({
	user_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'User',
	    required : true
	},
	group_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'Group',
	    required : true
	},
	content: {
		type: String,
		required : true
	},
	created_at: {
		type: Date,
		required : true
	}
});


module.exports = mongoose.model('Message',messageSchema);