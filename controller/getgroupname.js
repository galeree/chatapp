var Group = require('../models/group');

module.exports = function(groupid, callback) {
	var search = {'_id' : groupid};

	Group.findOne(search).exec(function(err, result) {
		var groupname = result.name;
		callback(err, groupname);
	});
}