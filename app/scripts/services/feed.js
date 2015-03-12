(function () {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular
	.module('titanApp')
	.factory('Feed', feedService);

feedService.$inject('$firebaseObject', '$firebaseArray', '$q', 'Auth', 'FIREBASE_URL');

function feedService($firebaseObj, $firebaseArr, $q, Auth, FIREBASE_URL) {
	
	// TODO: Add user authentication
	var query = FIREBASE_URL + 'users/' + user.uid + '/feeds'; 	
	var foo = {
		publicAddFeed : publicAddFeed,
		publicGetFeed : publicGetFeed,
		publicRemoveFeed : publicRemoveFeed,
		publicUpdateFeed : publicUpdateFeed
	};

	return foo;

	function publicAddFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}
		
		var promise = publicGetFeed()
			.then(function (feedsArr) { addFeed(feedsArr); })
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
		
		var promise = publicGetFeed()
			.then(function (feedsArr) { removeFeed(feedsArr); })
			.catch(function (e) { console.log('e'); });

		return promise;

	}
	
	// TODO Review implementation of feedObj with several properties 
	function publicUpdateFeed(newTitle, obj) {
		try {
			if (arguments.length !== 2 || typeof newTitle !== 'string' || 
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}

		if (obj.hasOwnProperty('title')) {
			var promise = publicGetFeed()
				.then(function (feedObj) {
					feedObj['title'] = newTitle;
					return syncChanges(feedObj);
				})
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
	
	function removeFeed (feedsArr, feedObj) {
		var deferred = $q.defer();
		var query = feedsArr.indexOf(feedObj);
		feedsArr.$remove(query)
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