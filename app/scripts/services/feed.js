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

feedService.$inject('$firebase', '$q', 'Auth', 'FIREBASE_URL');

function feedService($firebase, $q, Auth, FIREBASE_URL) {
	
	var query = FIREBASE_URL + 'users/' + user.uid + '/feeds'; 	
	var foo = {
		addFeed : addFeed
		getFeed : getFeed
		removeFeed : removeFeed
		updateFeed : updateFeed
	};

	return foo;

	function addFeed(feedObj) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}
		
		var deferred = $q.defer();
		var ref = new Firebase(query);
		var feeds = $firebase(ref).$asObject();
		
		feeds.$loaded().then(function () {
			feeds[feedObj.title] = feedObj;
			feeds.$save().then(function () {
				deferred.resolve();
			}).catch(function () {
				deferred.reject();
			}).catch(function () {
				deferred.reject();
			});
		});

		return deferred.promise;
	}

	function getFeed(feedTitle) {
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
		var ref = new Firebase(query);
		var sync = $firebase(ref)
		
		if (feedTitle) {
			var feed = sync.$asObject().$loaded().then(function () {
				deferred.resolve(feed);
			})catch(function (e) {
				deferred.reject(e);
			});
		} else {
			var feeds = sync.$asArray().$loaded().then(function () {
				deferred.resolve(feeds);
			}).catch(function (e) {
				deferred.reject(e);
			});
		}

		return deferred.promise;
	}

	function removeFeed(feedTitle) {
		try {
			if (arguments.length !== 1 || typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}
		
		var deferred = $q.defer();
		var ref = new Firebase(query);
		var feeds = $firebase(ref);
		
		feeds[feedObj.title] = null;
		feeds.$save().then(function () {
			deferred.resolve();
		}).catch(function () {
			deferred.reject();
		});
	}
	
	function updateFeed(feedTitle, feedObj) {
		try {
			if (arguments.length !== 2 || typeof feedTitle !== 'string' || 
				typeof feedObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			console.log(e);
		}

		var deferred = $q.defer();
		var query = query + '/' + feedTitle;
		var ref = new Firebase(query);
		var feed = $firebase(ref).$asObject();
		
		if (feedObj.hasOwnProperty("title")) {
	
			feed.$loaded().then(function () {
				feed['title'] = feedObj.title;
				feed.$save().then(function () {
					deferred.resolve();
				}).catch(function (e) {
					deferred.reject(e);
				});
			}).catch(function (e) {
				deferred.reject(e);
			});
		} else {
			deferred.reject(e);
		}

		return deferred.promise;
	}
}

})();