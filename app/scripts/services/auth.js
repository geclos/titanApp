(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Auth', authService);

authService.$inject('$firebaseAuth', '$log', '$q', 'FIREBASE_URL');

function authService ($firebaseAuth, $log, $q, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var auth = $firebaseAuth(ref);
	var service = {
		login: publicLogin
	};
	
	return service;

	function publicLogin (service) {
		var deferred = $q.defer();
		auth.$authwithOAuthPopUp()
			.then(function (authData) { deferred.resolve(authData); })
			.catch(function (e) { $log.error(e); });

		return deferred.promise;
	}
}
})();