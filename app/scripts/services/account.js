(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Account', accountService);

accountService.$inject = ['$rootScope', '$firebaseObject', '$firebaseArray',
	'$log', '$q', 'FIREBASE_URL'];

function accountService ($rootScope, $firebaseObj, $firebaseArr,
	$log, $q, FIREBASE_URL) {
	var service = {
		getAccount : getAccount,
		createAccount : createAccount
	};

	return service;

	function getAccount (userKey) {
		try{
			if (!userKey || typeof userKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		}catch(e){
			$log.error(e.message);
		}

		var ref = new Firebase(FIREBASE_URL + userKey); //jshint ignore:line
		var account = $firebaseObj(ref);
		return account.$loaded();
	}

	function createAccount () {
		var deferred = $q.defer();
		var data = {
			id : Math.random().toString(36).slice(-8) //jshint ignore:line
		};
		var ref = new Firebase(FIREBASE_URL); //jshint ignore:line
		var db = $firebaseArr(ref);
		db.$add(data)
			.then(function(ref) {
				localStore(ref, deferred);
				deferred.resolve(ref.key());
			})
			.catch(function(e) {deferred.reject(e);});

		return deferred.promise;
		// email/password implementation
		/*var db = $firebaseAuth(ref);
		db.$createUser(userData)
			.then(function(user) {
				localStorage.setItem('email', user.email);
				localStorage.setItem('password', user.password);
				deferred.resolve(user);
			})
			.catch(function(e) {
				$log.error(e);
				deferred.reject(e);
			});*/
	}

	function localStore(ref, deferred) {
		var userKey = ref.key();
		localStorage.setItem('userKey', userKey);
	}
}
})();
