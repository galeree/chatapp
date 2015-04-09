var Participation = require('../models/participation');
var Invitation = require('../models/invitation');

module.exports = function(request) {
	var user_id = request.user_id;
	var req_id = request.req_id;
	var group_id = request.group_id;
	var condition = request.condition;
	var options;

	if(condition == 'confirm') {
		// User confirm invitation
		// Update Invitation state to confirm	
		Invitation.update({'_id': req_id}, { status: 'confirm' }, options, function() {

		});

		// Add User to participate in the group
		var participation = new Participation({ user_id: user_id, 
												joined_at: (new Date).getTime(),
												group_id: group_id});
		participation.save(function(err) {
			if(err) console.log(err);
		});
	}else {
		// User decline invitation
		// Update Invitation state to decline
		Invitation.update({'_id': req_id}, { status: 'decline' }, 
							options, function(err) {});
	}
}