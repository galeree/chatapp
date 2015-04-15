(function() {
	// Create module name
	var app = angular.module('chat',[]);
	var controllers = {};
	
	// Create http service to send/receive ajax request
	app.service('roomService', function($http) {
		return {
			getMessage: function(content) {
				return $http.get('log?user_id=' + content.user_id + '&group_id=' + content.group_id);
			}
		}
	});

	controllers.RoomCtrl = function($scope, $http, roomService) {
		var user_id = $('body').data("id");
		// Just substring url to get group_id ignore it
		var temp = window.location.toString();
		var index = temp.indexOf('roomid=');
		temp = temp.substring(index+7);
      	var group_id = temp;
      	
      	// Create object that contain user_id and group_id
      	var content = { user_id: user_id, group_id: group_id};
      	$scope.getLog = function() {
      		roomService.getMessage(content).success(function(data) {
      			$scope.messages = data;
      		});
      	}

      	$scope.convert = function(timestamp) {
      		var time = new Date(timestamp);
      		return time.toLocaleTimeString();
      	}

		$scope.getLog();
	}

	app.controller(controllers);

})();
