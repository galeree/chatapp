var User = require('../models/user');

module.exports = function(query, callback) {
	var regex = new RegExp(query, "i");
	var search = { 'username' : regex };
	User.find(search, function(err, users) {
		var result = users;
   		callback(err, result);
	});
}