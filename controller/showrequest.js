var Invitation = require('../models/invitation');

module.exports = function(id, callback) {
	var search = {'user_id' : id};
	Invitation.find(search).where('status').equals('pending').populate('group_id').exec(function(err, invitations) {
		callback(err,invitations);
	});
}