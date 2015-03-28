(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Feed', feedService);

feedService.$inject = ['$rootScope', '$log', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];

function feedService($rootScope, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var ref, accountKey; 
	var Feed = function (feedObj) {
		this.title = feedObj.title;
		this.description = feedObj.description;
		this.link = feedObj.feedUrl;
		this.lastUpdate = Date.now();
		this.category = 'uncategorized';
	};
	var service = {
		getFeed : getFeed,
		setFeed : setFeed,
		updateFeed : updateFeed,
		removeFeed : removeFeed
	};

	$rootScope.$on('Authenticated', function(ev, data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + '/feeds/' + accountKey); // jshint ignore:line
	});

	return service;

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
		
		var feed = new Feed(feedObj);
		var db = $firebaseArr(ref);
		return db.$add(feed); // returns ref to object seted
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
			var feedTitle = ref.child(accountKey + '/' + feedKey + '/title');
			$firebaseObj(feedTitle).$value = obj.title;
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
