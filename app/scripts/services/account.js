(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Account', accountService);

accountService.$inject('$firebaseObject', '$log', '$q', 'FIREBASE_URL');

function accountService ($firebaseObj, $log, $q, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
	var service = {
		getAccount : publicGetAccount
	};

	return service;

	function publicGetAccount (authData) {
		var account = $firebaseObj(ref)
			.then(function (sync) { return getAccount(sync, authData); })
			.catch(function (e) { $log.error(e); });

		return account;
	}

	function getAccount (sync, authData) {
		var account = {};
		if (sync.hasOwnProperty(authData.uid)) {
			account = sync[authData.uid];
		} else {
			account = createAccount(sync, authData)
				.then(function (data) { return data; });
		}

		return account;
	}

	function createAccount (sync, authData) {

		// Customize info saved in the account obbject
		sync[authData.uid] = authData;
		var account = syncChanges(sync)
			.then(function () { return sync[authData.uid]; });

		return account;
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