var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Group = require('./group');
var User = require('./user');

var syncSchema = new Schema({
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
	modified_at: {
		type: Date,
		required : true
	}
});


module.exports = mongoose.model('Sync',syncSchema);