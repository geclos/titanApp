(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Account', accountService);

accountService.$inject = ['$firebaseObject', '$log', '$q', 'FIREBASE_URL'];

function accountService ($firebaseObj, $log, $q, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var service = {
		ref : ref,
		getAccount : publicGetAccount
	};

	return service;

	function publicGetAccount (authData) {
		var account = $firebaseObj(ref).$loaded()
			.then(function (sync) { return getAccount(sync, authData); })
			.catch(function (e) { $log.error(e); });

		return account;
	}

	function getAccount (sync, authData) {
		if (sync.hasOwnProperty(authData.uid)) {
			return sync[authData.uid];
		} else {
			var promise = createAccount(sync, authData)
				.then(function (promise) { return promise; });
			return promise;
		}
	}

	function createAccount (sync, authData) {

		sync[authData.uid] = authData;
		var promise = syncChanges(sync)
			.then(function (promise) { return promise; });

		return promise;
	}

	function syncChanges (sync) {
		var deferred = $q.defer();
		sync.$save()
			.then(function () { deferred.resolve(); })
			.catch(function (e) { $log.error(e); });

		return deferred.promise;
	}
}
})();