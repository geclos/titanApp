(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('Feed', feedService);

feedService.$inject('$firebaseObject', '$firebaseArray', '$q', 'FIREBASE_URL');

function feedService($firebaseObj, $firebaseArr, $q, FIREBASE_URL) {
	
	// TODO: Add user authentication
	var query = FIREBASE_URL; 	
	var service = {
		start : publicStart,
		AddFeed : publicAddFeed,
		GetFeed : publicGetFeed,
		RemoveFeed : publicRemoveFeed,
		UpdateFeed : publicUpdateFeed
	};

	return service;

	function publicStart (user.uid) {
		query = query + 'users/' + user.uid + '/feeds';
	}

	function publicAddFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}
		
		var promise = publicGetFeed()
			.then(function (feedsArr) { addFeed(feedsArr, feedObj); })
			.catch(function () { console.log('e'); });

		return promise;
	}
	
	function publicGetFeed(feedTitle) {
		try {
			if (arguments.length > 1 || typeof feedTitle !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}

		var deferred = $q.defer();
		var query = feedTitle ? 
					query + '/' + feedTitle : 
					query; 
		var ref = new Firebase(query); //jshint ignore:line
		
		if (feedTitle) {
			var feed = $firebaseObj().$loaded()
				.then(function () { deferred.resolve(feed); })
				.catch(function (e) { deferred.reject(e); });
		} else {
			var feeds = $firebaseArr().$loaded()
				.then(function () { deferred.resolve(feeds); })
				.catch(function (e) { deferred.reject(e); });
		}

		return deferred.promise;
	}

	function publicRemoveFeed(feedTitle) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}
		
		var promise = publicGetFeed(feedTitle)
			.then(function (feedObj) { removeFeed(feedObj); })
			.catch(function (e) { console.log('e'); });

		return promise;
	}
	
	// TODO Review implementation of feedObj with several properties 
	function publicUpdateFeed(feedTitle, obj) {
		try {
			if (arguments.length !== 2 || typeof feedTitle !== 'string' || 
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}

		if (obj.hasOwnProperty('title')) {
			var promise = publicGetFeed(feedTitle)
				.then(function (feedObj) { return changeFeedTitle(feedObj, obj.title); })
				.catch(function (e) { console.log('e'); });
			
			return promise;
		} else {
			return false;
		}
	}
	
	function syncChanges(feed) {
		var deferred = $q.defer();
		feed.$save()
			.then(function () {	deferred.resolve();	})
			.catch(function (e) { deferred.reject(e); });
		
		return deferred.promise;
	}
	
	function addFeed (feedsArr, feedObj) {
		var deferred = $q.defer();
		feedsArr.$add(feedObj)
			.then(function () { deferred.resolve();	})
			.catch(function (e) { deferred.reject(e); });

		return deferred.promise;
	}
	
	function removeFeed (feedObj) {
		var deferred = $q.defer();
		feedObj.$remove()
			.then(function () { deferred.resolve(); })
			.catch(function () { deferred.reject();	});

		return deferred.promise;
	}
	
	function changeFeedTitle (feedObj, newTitle) {
		feedObj['title'] = newTitle;
		return syncChanges(feedObj);
	}
}
})();