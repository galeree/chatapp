var controller = {};
var Message = require('../models/message');
var Participation = require('../models/participation');

controller.addMessage = function(message) {
	var message = new Message({ user_id: message.user_id, group_id: message.group_id,
								content: message.content, created_at: message.time});
	message.save(function(err){
		if(err) console.log(err);
		else console.log(message);
	});
}

controller.getLog = function(user_id, group_id, callback) {
	console.log('user_id: ' + user_id + ' group_id: ' + group_id);
	Participation.find({'group_id' : group_id})
				 .exec(function(err, participation) {
		if(err) callback(err,'');
		else {
			for(var i=0;i < participation.length;i++) {
				var join_time = participation[i].joined_at;
				Message.find({'group_id' : group_id})
					   .where('created_at').gt(join_time)
					   .populate('user_id')
					   .exec(function(err2, messages) {
					   	callback(err2, messages);
				});
			}
		}
	});
}

controller.leaveGroup = function(user_id, group_id) {

}

module.exports = controller;