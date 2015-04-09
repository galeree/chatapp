var Invitation = require('../models/invitation');

module.exports = function() {
	/*var search = {'_id' : '55255f54b1f686c11a79a439'};
	var options;
	Invitation.update(search, { status: 'pending' }, options, function() {

	});*/

	var search = {'_id': '55255f54b1f686c11a79a439'};
	Invitation.find(search, function(err, result) {
		if(!err) console.log(result);
		else console.log(err);
	});
}