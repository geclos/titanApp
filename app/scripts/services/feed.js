(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Feed', feedService);

feedService.$inject = ['$q', '$sce', '$log', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];

function feedService($q, $sce, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var	ref, accountKey; 
	var Feed = function (feedObj) {
		this.title = feedObj.title;
		this.description = feedObj.description;
		this.link = feedObj.feedUrl;
		this.lastUpdate = Date.now();
		this.category = 'uncategorized';
	};
	var service = {
		startService : startService,
		getFeed : getFeed,
		setFeed : setFeed,
		updateFeed : updateFeed,
		removeFeed : removeFeed
	};

	return service;

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + '/feeds/' + accountKey); // jshint ignore:line
	}

	function getFeed(feedKey) {
		try {
			if (arguments.length > 1 || arguments.length === 1 && typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		if (feedKey) {
			var feedRef = ref.child(accountKey + '/' + feedKey);
			return $firebaseObj(feedRef).$loaded();
		} else {
			return $firebaseArr(ref).$loaded();
		}
	}

	function setFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}
		
		var deferred = $q.defer();
		var feed = new Feed(feedObj);
		var childRef = ref.child(feed.title);
		childRef.set(feed, function(e) { 
			if (e) {
				deferred.reject(e);
			} else {
				deferred.resolve(childRef.key());
			} 
		});
		
		return deferred.promise;
	}

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
			var deferred = $q.defer();
			var childRef = ref.child(accountKey + '/' + feedKey + '/title');
			childRef.set(obj.title, function(e) { 
				if (e) {
					deferred.reject(e);
				} else {
					deferred.resolve();
				}
			});

			return deferred.promise;
		} else {
			return false;
		}
	}

	function removeFeed(feedKey) {
		try {
			if (arguments.length !== 1 || typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var feedRef = ref.child(accountKey + '/' + feedKey);
		return $firebaseObj(feedRef).$remove();
	}
}
})();
