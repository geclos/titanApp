(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Feed', feedService);

feedService.$inject = ['$q', '$sce', '$log', '$firebaseObject', 
'$firebaseArray', 'FIREBASE_URL'];

function feedService($q, $sce, $log, $firebaseObj, 
	$firebaseArr, FIREBASE_URL) {
	var	ref, accountKey; 
	var Feed = function (feedObj) {
		this.title = feedObj.title;
		this.description = feedObj.description;
		this.link = feedObj.feedUrl;
		this.lastUpdate = Date.now();
		this.category = 'uncategorized';
	};
	var service = {
		getFeed : getFeed,
		lastUpdated : lastUpdated,
		removeFeed : removeFeed,
		setFeed : setFeed,
		startService : startService,
		updateFeed : updateFeed
	};

	return service;

	function removeFeed(feedKey) {
		try {
			if (arguments.length !== 1 || 
				typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var feedRef = ref.child(feedKey);
		return $firebaseObj(feedRef).$remove();
	}

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + 
		'/feeds/' + accountKey); // jshint ignore:line
	}

	function getFeed(feedKey, feedProp) {
		try {
			if (arguments.length > 2 || 
				typeof feedKey !== 'string' ||
				typeof feedProp !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		if (feedKey) {
			var feedRef = ref.child(feedKey);
			if (feedProp) {
				var propRef = feedRef.child(feedProp);
				return $firebaseObj(propRef).$value;
			}
			return $firebaseObj(feedRef);
		} else {
			return $firebaseArr(ref);
		}
	}

	function lastUpdated(feedKey) {
		try {
			if (arguments.length !== 1 || typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var childRef = ref.child(feedKey + '/lastUpdate');
		return $firebaseObj(childRef).$value;
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

	function updateFeed(feedKey, feedProp) {
		try	{
			if (arguments.length !== 2 || 
				typeof feedKey !== 'string' ||
				typeof feedProp !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		childRef = ref.child(feedKey + '/' + feedProp.name);
		return childRef.set(feedProp.value, function(e) {
			if (e) {
				$log.error(e);
			} else {
				return true;
			}
		});
	}

}
})();
