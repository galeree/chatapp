(function() {
	var app = angular.module('chat',[]);
	var controllers = {};
	
	app.service('roomService', function($http) {
		return {
			getMessage: function(content) {
				return $http.get('log?user_id=' + content.user_id + '&group_id=' + content.group_id);
			}
		}
	});

	controllers.RoomCtrl = function($scope, $http, roomService) {
		var user_id = $('body').data("id");
		var temp = window.location.toString();
		var index = temp.indexOf('roomid=');
		temp = temp.substring(index+7);
      	var group_id = temp;
      	var content = { user_id: user_id, group_id: group_id};
      	$scope.getLog = function() {
      		roomService.getMessage(content).success(function(data) {
      			$scope.messages = data;
      			console.log(data);
      		});
      	}

		$scope.getLog();
	}

	app.controller(controllers);

})();
