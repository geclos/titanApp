(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Auth', authService);

authService.$inject = ['$rootScope','$firebaseAuth', '$log', '$q',
	'FIREBASE_URL'];

/* @ngInject */
function authService ($rootScope, $firebaseAuth, $log, $q, FIREBASE_URL) {
	// Firebase implementation
	/*
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	*/
	var service = {
		requireAuth : requireAuth
	};

	return service;

	function requireAuth(bool) {
		var deferred = $q.defer();
		var accountKey = localStorage.getItem('accountKey');
		if (accountKey) {
			deferred.resolve(accountKey);
		} else {
			var e = 'AUTH_REQUIRED';
			deferred.reject(e);
		}

		return deferred.promise;

		// Firebase implementation
		/*
		var deferred = $q.defer();
		if (bool) {
			auth.$requireAuth()
				.then(function(authData) {
					deferred.resolve(authData);
				})
				.catch(function(e) {deferred.reject(e);}); // returns null
		} else {
			auth.$waitForAuth()
				.then(function(authData) {
					deferred.resolve(authData);
				})
				.catch(function(authData) {deferred.reject(authData);});
		}

		return deferred.promise;
		*/
	}
}
})();
