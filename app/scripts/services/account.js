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

/* @ngInject */
function accountService ($q, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var	ref, accountKey; // jshint ignore:line
	var Account = function () {
		this.userAgent = navigator.userAgent;
		this.subscriptions = 0;
	};
	var service = {
		getAccount : getAccount,
		getSubscriptions : getSubscriptions,
		removeAccount : removeAccount,
		setAccount : setAccount,
		setSubscription : setSubscription,
		startService : startService
	};

	return service;

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + '/accounts/' + accountKey); // jshint ignore:line
	}

	function getAccount() {
		try {
			if (arguments.length !== 0) {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		return $firebaseObj(ref);
	}

	function getSubscriptions() {
		try {
			if (arguments.length !== 0) {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var childRef = ref.child('subscriptions');
		return $firebaseArr(childRef);
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

	function setSubscription(feedKey) {
		try {
			if (arguments.length !== 1 ||
				typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var deferred = $q.defer();
		var childRef = ref.child('subscriptions/' + feedKey);
		childRef.set(true, function(e) {
			if (e) {
				deferred.reject(e);
			} else {
				deferred.resolve(childRef.key());
			}
		});

		return deferred.promise;
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
