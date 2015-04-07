(function() {
	var app = angular.module('account', []);
	var controllers = {};

	controllers.GroupCtrl = function($scope, $http) {
		console.log('test');
	}

	app.controller(controllers);
})();