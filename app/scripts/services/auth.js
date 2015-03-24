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
	// Firebase implementation
	/*	
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	*/
	var service = {
		signup: signup,
		requireAuth : requireAuth 
	};
	
	return service;

	function signup(service) {
		var browserID = math.random().toString(36).slice(-8); //jshint ignore:line
		localStorage.setItem('browserID', browserID);
		return browserID;
		// Firebase implementation
		/*
		var deferred = $q.defer();
		auth.$authwithOAuthPopUp()
			.then(function (authData) { 
				deferred.resolve(authData);
			})
			.catch(function (e) { $log.error(e); });

		return deferred.promise;
		*/	
	}

	function requireAuth(bool) {
		var browserID = localStorage.getItem('browserID');
		if (browserID) {
			return browserID;
		} else {
			var e = new Error('Not authenticated');
			return e;
		}
		
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