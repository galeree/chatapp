var Participation = require('../models/participation');

module.exports = function(id, callback) {
	var search = {'group_id' : id};
	Participation.find(search).populate('user_id').exec(function(err, participations) {
		callback(err,participations);
	});
}