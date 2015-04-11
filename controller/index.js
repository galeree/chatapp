// Initiate controller
var controller = {};

// Include necessary Model
var Message = require('../models/message');
var Participation = require('../models/participation');

// Add message module 
// When user send chat message trigger this module
controller.addMessage = function(message) {
	// Create message variable to contain message record
	var message = new Message({ user_id: message.user_id, group_id: message.group_id,
								content: message.content, created_at: message.time});
	
	// Save a message record into a database
	message.save(function(err){});
}

// Get log module
// Used to retrieve message when user enter the group after exit it
controller.getLog = function(user_id, group_id, callback) {
	// Find a participation record with specific user_id and group_id
	// to get the joined time that the user join the group
	Participation.find({'group_id' : group_id})
				 .exec(function(err, participation) {
		
		// If error return with error
		if(err) callback(err,'');
		else {
			
			// If not error get an array of result.
			// So we have to loop through the array to get data.
			for(var i=0;i < participation.length;i++) {
				
				// Create a variable to contain joined time.
				var join_time = participation[i].joined_at;

				// Find a message of the particular group_id
				// after the join time. Then, join the result
				// with user table using foreign key(user_id)
				// to join it
				// We join table to get the username that send
				// each particular message.
				Message.find({'group_id' : group_id})
					   .where('created_at').gt(join_time)
					   .populate('user_id')
					   .exec(function(err2, messages) {
					   	// Send a result to the process that call it.
					   	callback(err2, messages);
				});
			}
		}
	});
}

// Leave group module
controller.leaveGroup = function(user_id, group_id) {
	// Implement here
}

module.exports = controller;