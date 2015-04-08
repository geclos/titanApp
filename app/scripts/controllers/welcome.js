(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.controller('welcomeCtrl', welcomeCtrl);

welcomeCtrl.$inject = [
	'$scope',
	'$location',
	'$log',
	'Account',
	'Auth'
  ];

function welcomeCtrl($scope, $location, $log, Account, Auth) {
	/* jshint validthis: true */
	var vm = this;

	vm.signUp = signUp;

	function signUp() {
		vm.creatingAccount = true;
		var accountKey = localStorage.getItem('accountKey'); 
		if (accountKey) {
			Account.getAccount(accountKey)
				.then(function() {$location.path('/');});
		} else {
			Account.setAccount()
				.then(function() {redirect();})
				.catch(function(e) {$log.error(e);});
		}
	}

	function redirect() {
		$location.url('/');
	}
}

})();