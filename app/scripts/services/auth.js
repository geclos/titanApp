(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Auth', authService);

authService.$inject = [ '$rootScope','$firebaseAuth', '$log', '$q',
	'FIREBASE_URL'];

function authService ($rootScope, $firebaseAuth, $log, $q, FIREBASE_URL) {
	// Firebase implementation
	/*
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	*/
	var service = {
		signUp : signUp,
		requireAuth : requireAuth
	};

	return service;

	function signUp(userKey) {
		localStorage.setItem('userKey', userKey);
		return true;
		// Firebase implementation
		/*var deferred = $q.defer();
		auth.$authwithOAuthPopUp()
			.then(function (authData) {
				deferred.resolve(authData);
			})
			.catch(function (e) { $log.error(e); });

		return deferred.promise;*/
	}

	function requireAuth(bool) {
		var deferred = $q.defer();
		var userKey = localStorage.getItem('userKey');
		if (userKey) {
			deferred.resolve(userKey);
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
