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

/* @ngInject */
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
		ref = new Firebase(FIREBASE_URL + // jshint ignore:line 
		'/feeds/' + accountKey); 
	}

	function getFeed(feedKey, feedProp) {
		try {
			if (arguments.length > 2 ||
				arguments.length < 1) {
				throw new Error('Arguments do not match specification');
			} else if (arguments.length === 2 && 
				typeof feedKey !== 'string' ||
				arguments.length === 2 &&
				typeof feedProp !== 'string') {
				throw new TypeError('Arguments\' type do not match specification');
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

		var deferred = $q.defer();
		var childRef;
		for(var key in feedProp) {
			if (ref.child(feedKey + '/' + key)) {
				childRef = ref.child(feedKey + '/' + key);
				childRef.set(feedProp[key], function(e) {
					if (e) {
						deferred.reject(e);
					}
				});
			}
		}
		deferred.resolve();

		return deferred.promise;
	}
}
})();
