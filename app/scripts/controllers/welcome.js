(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.controller('welcomeCtrl', welcomeCtrl);

	welcomeCtrl.$inject = ['$scope', '$location', '$log', 'Account', 'Auth'];

	function welcomeCtrl($scope, $location, $log, Account, Auth) {
		$scope.signUp = signUp;

		function signUp() {
			var userKey = localStorage.getItem('userKey'); 
			if (userKey) {
				Account.getAccount(userKey)
					.then(function() {$location.path('/');});
			} else {
				Account.createAccount()
					.then(redirect())
					.catch(function(e) {$log.error(e);});
			}
		}

		function redirect() {
			$location.path('/');
		}
	}

})();