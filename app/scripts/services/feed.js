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

	function start(browserKey) {
		query = FIREBASE_URL + '/' + browserKey + '/feeds';
	}

	function addFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var feed = {
			// TODO...
		};
		var promise = getFeed() // returns list of feeds in db
			.then(function (feedsArr) { return feedsArr.$add(feed); }) // returns ref to object added
			.catch(function (e) { $log.error(e); });

		return promise;
	}

	function getFeed(feedKey) {
		try {
			if (arguments.length > 1 || typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		var deferred = $q.defer();
		var query = feedKey ?
					query + '/' + feedKey :
					query;
		var ref = new Firebase(query); //jshint ignore:line
		var response;
		if (feedKey) {
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

	function removeFeed(feedKey) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var promise = getFeed(feedKey)
			.then(function (feedObj) { return feedObj.$remove(); })
			.catch(function (e) { $log.error(e); });

		return promise;
	}

	// TODO Review implementation of feedObj with several properties
	function updateFeed(feedKey, obj) {
		try {
			if (arguments.length !== 2 || typeof feedKey !== 'string' ||
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		if (obj.hasOwnProperty('title')) {
			var promise = getFeed(feedKey)
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
