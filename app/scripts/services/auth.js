(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Auth', authService);

authService.$inject = ['$firebaseAuth', '$log', '$q', 'FIREBASE_URL'];

function authService ($firebaseAuth, $log, $q, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	var service = {
		login: publicLogin,
		requireAuth : publicRequireAuth 
	};
	
	return service;

	function publicLogin(service) {
		var deferred = $q.defer();
		auth.$authwithOAuthPopUp()
			.then(function (authData) { deferred.resolve(authData); })
			.catch(function (e) { $log.error(e); });

		return deferred.promise;
	}

	function publicRequireAuth(bool) {
		var deferred = $q.defer(); 
		if (bool) {
			auth.$requireAuth()
				.then(function(user) {deferred.resolve(user)})
				.catch(function(user) {deferred.resolve(user)});
		} else {
			auth.$waitForAuth()
				.then(function(user) {deferred.resolve(user)})
				.catch(function(useer) {deferred.resolve(user)});
		}

		return deferred.promise;
	}
}
})();