var Participation = require('../models/participation');

module.exports = function(id, groupid, callback) {
	var search = {'user_id' : id, 'group_id' : groupid};

	Participation.findOne(search).exec(function(err, participations) {
		callback(err,participations);
	});
}