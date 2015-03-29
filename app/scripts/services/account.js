(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Account', accountService);

accountService.$inject = ['$q', '$log', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];

function accountService ($q, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var	ref, accountKey; // jshint ignore:line
	var Account = function () {
		this.userAgent = navigator.userAgent;
		this.subscriptions = 0;
	};
	var service = {
		startService : startService,
		getAccount : getAccount,
		setAccount : setAccount,
		updateAccount : updateAccount,
		removeAccount : removeAccount
	};

	return service;

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + '/accounts/' + accountKey); // jshint ignore:line
	}

	function getAccount(accountKey) {
		try {
			if (arguments.length > 1 || arguments.length === 1 && typeof accountKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		if (accountKey) {
			var accountRef = ref.child('/' + accountKey);
			return $firebaseObj(accountRef);
		} else {
			return setAccount();
		}
	}

	function setAccount() {
		var deferred = $q.defer();
		var account = new Account();
		var ref = new Firebase(FIREBASE_URL + '/accounts'); //jshint ignore:line
		var accountArr = $firebaseArr(ref).$add(account)
			.then(function(ref) {
				var accountKey = ref.key();
				localStorage.setItem('accountKey', accountKey);
				deferred.resolve();
			})
			.catch(function(e) {deferred.reject(e);});

		return deferred.promise;
	}

	function updateAccount(obj) {
		try {
			if (arguments.length !== 1 ||
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var deferred = $q.defer();
		for (var key in obj) {
			if (key === 'subscriptions') {
				ref.child(key + '/' + obj[key]).set(true);
			} else {
				ref.child(key).set(obj[key]);
			}
		}
	}

	function removeAccount(accountKey) {
		try {
			if (arguments.length !== 1 || typeof accountKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var accountRef = ref.child('/' + accountKey);
		return $firebaseObj(accountRef).$remove();
	}

}
})();
