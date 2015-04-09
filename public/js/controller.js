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
	})

	controllers.HomeCtrl = function($scope, $http, groupService, $modal, $log) {
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
				console.log(data);
			});
		}

		$scope.open = function(group_id, name, req_id) {
			var modalInstance = $modal.open({
				templateUrl: 'modal.html',
				controller: 'ModalCtrl',
				resolve: {
					group_id: function() {
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
			modalInstance.result.then(function() {
				$scope.getGroup();
				$scope.getRequest();
			});
		};

		$scope.getGroup();
		$scope.getRequest();
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
			var obj = {username: account.username, id: account._id };
			$scope.select.push(obj);
			var elem = document.getElementById("choice");
			elem.value = JSON.stringify($scope.select);
		}

	}

	app.controller(controllers);
})();