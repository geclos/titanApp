(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Auth', authService);

authService.$inject = [ '$rootScope','$firebaseAuth', '$log', '$q', 'FIREBASE_URL'];

function authService ($rootScope, $firebaseAuth, $log, $q, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	var service = {
		login: login,
		requireAuth : requireAuth 
	};
	
	return service;

	function login(service) {
		var deferred = $q.defer();
		auth.$authwithOAuthPopUp()
			.then(function (authData) { 
				$rootScope.$broadcast('Authenticated', authData);
				deferred.resolve(authData);
			})
			.catch(function (e) { $log.error(e); });

		return deferred.promise;
	}

	function requireAuth(bool) {
		var deferred = $q.defer(); 
		if (bool) {
			auth.$requireAuth()
				.then(function(authData) {
					$rootScope.$broadcast('Authenticated', authData);
					deferred.resolve(authData);
				})
				.catch(function(e) {deferred.reject(e);}); // returns null
		} else {
			auth.$waitForAuth()
				.then(function(authData) {
					$rootScope.$broadcast('Authenticated', authData);
					deferred.resolve(authData);
				})
				.catch(function(authData) {deferred.reject(authData);});
		}

		return deferred.promise;
	}
}
})();