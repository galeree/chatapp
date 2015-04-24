(function() {
	var app = angular.module('account', ['ui.bootstrap']);
	var controllers = {};

	app.service('searchService', function($http) {
		return {
			getAccount: function(query) {
				return $http.get('/search?query=' + query);
			}
		}
	});

	app.service('groupService', function($http) {
		return {
			getGroup: function(query) {
				return $http.get('/grouplist?user_id=' + query);
			},
			getRequest: function(query) {
				return $http.get('/grouprequest?user_id=' + query);
			}
		}
	});

	controllers.HomeCtrl = function($scope, $http, groupService, $modal, $log) {
		// Get user id
		var id = $('body').data("id");
		$scope.groups = [];
		$scope.requests = [];
		$scope.getGroup = function() {
			groupService.getGroup(id).success(function(data) {
				$scope.groups = data;
			});
		}

		$scope.getRequest = function() {
			groupService.getRequest(id).success(function(data) {
				$scope.requests = data;

			});
		}

		


		// When user click list in request list trigger this method
		$scope.open = function(group_id, name, req_id) {

			var modalInstance = $modal.open({
				templateUrl: 'modal.html',
				controller: 'ModalCtrl',
				resolve: {
					group_id: function() {
						//console.log("group_id = "+group_id +" from public/js/controller.js open resolve (pending group)");
						return group_id;
					},
					name: function() {
						return name;
					},
					req_id: function() {
						return req_id;
					}
				}
			});

			// When close modal update Group list and Pending list
			modalInstance.result.then(function() {
				$scope.getGroup();
				$scope.getRequest();
			});
		};

		// When user click list in group list trigger this method
		$scope.openGroup = function(group_id, name) {
			var modalInstance = $modal.open({
				templateUrl: 'group.html',
				controller: 'GroupCtrl',//see controllers.GroupCtrl (below)
				resolve: {
					group_id: function() {
						//console.log("group_id = "+group_id +" from openGroup resolve public/js/controller.js");//undefine
						return group_id;
					},
					name: function() {
						return name;
					}
				}
			});

			// When close modal update Group list and Pending list
			modalInstance.result.then(function() {
				$scope.getGroup();
				$scope.getRequest();
			});
		}

		$scope.getGroup();
		$scope.getRequest();
	}

	controllers.GroupCtrl = function($scope, $http, group_id, name, $modalInstance) {
		var user_id = $('body').data("id");
		$scope.name = name;
		$scope.group_id = group_id;

		$scope.participants = ["111", "222", "333", "4444"];

		var data12 = {'group_id': group_id};// send what
		console.log(data12);
		$scope.participants = [];

		$http.post('/groupparticipants' , data12).success(function(result) {
	        $scope.participants=result;
	    });

		$scope.leave = function() {
	        var data = {'user_id' : user_id, 'name' : $scope.name, 
	                    'group_id': $scope.group_id};
	        /*//console.log will show in console's broswer
	        console.log("step 1 Leave from public/js/controller.js-----------------------");
	        console.log("user_id = "+user_id +" from public/js/controller.js");//ok
	        console.log("group_id = "+$scope.group_id +" from public/js/controller.js");//undefine->ok
	        console.log("name = "+$scope.name +" from public/js/controller.js");//ok must $scope.name
	        */
	        $http.post('/leave', data).success(function(result) {
	            $modalInstance.close();
	        });
	    }

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}		
	}

	controllers.ModalCtrl = function($scope, $http, group_id, name, $modalInstance, req_id) {
		var user_id = $('body').data("id");
		
		$scope.name = name;
		$scope.accept = function() {
			var data = {'user_id' : user_id, 'req_id': req_id, 
						'group_id': group_id, 'condition' : 'confirm'};
			$http.post('/confirm', data).success(function(result) {
				$modalInstance.close();
			});
		};

		$scope.decline = function() {
			var data = {'user_id' : user_id, 'req_id': req_id, 
						'group_id': group_id, 'condition' : 'decline'};
			$http.post('/confirm', data).success(function(result) {
				$modalInstance.close();
			});
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};



	}

	controllers.FormCtrl = function($scope, $http, searchService) {
		// Contain list of selected user that is add to group
		$scope.select = [];
		
		/* Watch for list search field change */
		$scope.$watch('query', function() {
			$scope.getAccount($scope.query);
		});

		/* Get account list result */
		$scope.getAccount = function(query) {
			if(query === '') {
				$scope.choice = {};
			}else {
				searchService.getAccount(query).success(function(data) {
					$scope.choice = data;
				});
			}
		};

		/* Add user to group */
		$scope.adduser = function(account) {
			var user_name = $('body').data("username");
			var obj = {username: account.username, id: account._id };
			if(account.username == user_name){
				console.log("Not invite yourself!!!");
			} else{
				$scope.select.push(obj);
				var elem = document.getElementById("choice");
				elem.value = JSON.stringify($scope.select);
			}
		}
	}


	app.controller(controllers);
})();