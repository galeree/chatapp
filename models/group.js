var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var groupSchema = new Schema({
	name: {
	    type: String,
	    required : true
	},
	owner_id: {
	    type: Schema.Types.ObjectId,
	    ref: 'User',
	    required : true 
	},
	created_at: {
	    type: Date,
	    required : true
	}
});

module.exports = mongoose.model('Group', groupSchema);