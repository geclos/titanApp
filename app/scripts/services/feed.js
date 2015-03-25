(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Feed', feedService);

feedService.$inject = ['$log', '$firebaseObject', '$firebaseArray',
	'$q', 'FIREBASE_URL'];

function feedService($log, $firebaseObj, $firebaseArr, $q, FIREBASE_URL) {
	var query;
	var service = {
		start : start,
		addFeed : addFeed,
		getFeed : getFeed,
		removeFeed : removeFeed,
		updateFeed : updateFeed
	};

	return service;

	function start(browserID) {
		// var deferred = $q.defer();
		query = FIREBASE_URL + '/' + browserID + '/feeds';
	}

	function addFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var promise = getFeed()
			.then(function (feedsArr) { return feedsArr.$add(); })
			.catch(function (e) { $log.error(e); });

		return promise;
	}

	function getFeed(feedID) {
		try {
			if (arguments.length > 1 || typeof feedID !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var deferred = $q.defer();
		var query = feedID ?
					query + '/' + feedID :
					query;
		var ref = new Firebase(query); //jshint ignore:line
		var response;
		if (feedID) {
			response = $firebaseObj(ref).$loaded()
				.then(function () { deferred.resolve(response); })
				.catch(function (e) { deferred.reject(e); });
		} else {
			response = $firebaseArr(ref).$loaded()
				.then(function () { deferred.resolve(response); })
				.catch(function (e) { deferred.reject(e); });
		}

		return deferred.promise;
	}

	function removeFeed(feedID) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var promise = getFeed(feedID)
			.then(function (feedObj) { return feedObj.$remove(); })
			.catch(function (e) { $log.error(e); });

		return promise;
	}

	// TODO Review implementation of feedObj with several properties
	function updateFeed(feedID, obj) {
		try {
			if (arguments.length !== 2 || typeof feedID !== 'string' ||
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		if (obj.hasOwnProperty('title')) {
			var promise = getFeed(feedID)
				.then(function (feedObj) {
					return changeFeedTitle(feedObj, obj.title);
				})
				.catch(function (e) {$log.error('e');});

			return promise;
		} else {
			return false;
		}
	}

	function changeFeedTitle (feedObj, newTitle) {
		feedObj['title'] = newTitle;
		return syncChanges(feedObj);
	}

	function syncChanges(feedObj) {
		var deferred = $q.defer();
		feedObj.$save()
			.then(function () {	deferred.resolve(true);	})
			.catch(function (e) { deferred.reject(e); });

		return deferred.promise;
	}
}
})();
