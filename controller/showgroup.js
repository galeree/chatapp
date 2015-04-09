var Participation = require('../models/participation');

module.exports = function(id, callback) {
	var search = {'user_id' : id};
	Participation.find(search).populate('group_id').exec(function(err, participations) {
		callback(err,participations);
	});
}