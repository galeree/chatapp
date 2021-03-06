var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Group = require('./group');
var User = require('./user');

var participationSchema = new Schema({
	user_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'User',
	    required : true
	},
	joined_at: {
	    type: Date,
	    required : true 
	},
	group_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'Group',
	    required : true
	}
});


module.exports = mongoose.model('Participation',participationSchema);