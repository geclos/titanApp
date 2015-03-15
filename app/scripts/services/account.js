(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Account', accountService);

accountService.$inject = ['$rootScope', '$firebaseObject', '$firebaseAuth', '$log', '$q', 'FIREBASE_URL'];

function accountService ($rootScope, $firebaseObj, $firebaseAuth, $log, $q, FIREBASE_URL) {
	var service = {
		getAccount : getAccount,
		createAccount : createAccount
	  };
	
	return service;

	function getAccount (authData) {
		var deferred = $q.defer();
		var ref = new Firebase(FIREBASE_URL + authData.uid); //jshint ignore:line
		var account = $firebaseObj(ref);
		
		account.$loaded()
			.then(function() {deferred.resolve(account);})
			.catch(function(e) {
				$log.error(e);
				deferred.reject(e);
			});
		
		return deferred.promise;
	}

	function createAccount (authData) {
		var deferred = $q.defer();
		var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
		var db = $firebaseAuth(ref);
		var userData = {
			email: authData.email,
			password: math.random().toString(36).slice(-8) //jshint ignore:line
		  };
		db.$createUser(userData)
			.then(function(user) {deferred.resolve(user);})
			.catch(function(e) {
				$log.error(e);
				deferred.reject(e);
			});		

		return deferred.promise;
	}
}
})();