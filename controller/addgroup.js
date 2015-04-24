// Module for adding group
var Group = require('../models/group');
var Participation = require('../models/participation');
var Invitation = require('../models/invitation');

module.exports = function(id, member, groupname) {
	var group = new Group({ name: groupname, 
							owner_id: id, 
							created_at: (new Date).getTime()});
	group.save(function(err, elem) {
		if(err) {
			console.log(err);
		}else {
			console.log(group);
			var participation = new Participation({ user_id: id, 
													joined_at: (new Date).getTime(),
													group_id: group._id});
			participation.save(function(err2) {
				if(err2) console.log(err2);
			});

			for(var i=0;i<member.length;i++) {
				var invitation = new Invitation({ user_id: member[i].id,
												  create_at: (new Date).getTime(),
												  group_id: group._id,
												  status: 'pending'});
				invitation.save(function(err3) {
					if(err3) console.log(err3);
				});
			}
		}
		// test
	});
}