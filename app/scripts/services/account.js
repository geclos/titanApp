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
	var	ref = new Firebase(FIREBASE_URL + '/accounts'); // jshint ignore:line
	var Account = function () {
		this.userAgent = navigator.userAgent;
	};
	var service = {
		getAccount : getAccount,
		setAccount : setAccount,
		updateAccount : updateAccount,
		removeAccount : removeAccount
	};

	return service;

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
			return $firebaseObj(accountRef).$loaded();
		} else {
			return setAccount();
		}
	}

	function setAccount() {
		var deferred = $q.defer();
		var account = new Account();
		$firebaseArr(ref).$add(account)
			.then(function(ref) {
				var accountKey = ref.key();
				localStorage.setItem('accountKey', accountKey);
				deferred.resolve();
			})
			.catch(function(e) {deferred.reject(e);});

		return deferred.promise;
	}

	function updateAccount(accountKey, obj) {
		try {
			if (arguments.length !== 2 || typeof accountKey !== 'string' ||
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		if (obj.hasOwnProperty('title')) {
			var accountTitle = ref.child('/' + accountKey + '/title');
			$firebaseObj(accountTitle).$value = obj.title;
		} else {
			return false;
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
