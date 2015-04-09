var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Group = require('./group');

var invitationSchema = new Schema({
	user_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'User',
	    required : true
	},
	create_at: {
	    type: Date,
	    required : true 
	},
	group_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'Group',
	    required : true
	},
	status: {
		type: String
	}
});


module.exports = mongoose.model('Invitation',invitationSchema);