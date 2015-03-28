(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Post', postService);

postService.$inject = ['$rootScope', '$log', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];

function postService($rootScope, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var ref, accountKey;
	var Post = function (postObj) {
		this.title = postObj.title;
		this.link = postObj.link;
		this.author = postObj.author;
		this.content = postObj.content;
		this.contentSnippet = postObj.contentSnippet;
		this.publishedDate = postObj.publishedDate;
	};
	var service = {
		startService : startService,
		getPost : getPost,
		setPost : setPost,
		updatePost : updatePost,
		removePost : removePost
	};

	return service;

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + '/posts/' + accountKey); // jshint ignore:line
	}

	function getPost(feedKey, postKey) {
		try {
			if (arguments.length > 1 || arguments.length === 1 && typeof postKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		var postRef = ref.child('/' + feedKey + '/' + postKey);
		return $firebaseObj(postRef).$loaded();
	}

	function setPost(feedKey, entriesArr) {
		try {
			if (arguments.length !== 2 ||
				entriesArr.constructor !== Object &&
				entriesArr.constructor !== Array) {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var post;
		var postsArr = [];
		for (var i = entriesArr.length - 1; i >= 0; i--) {
		 	post = new Post(entriesArr[i]);
		 	postsArr.push(post);
		} 
		var childRef = ref.child(feedKey);
		var db = $firebaseObj(childRef);
	 	return db.$loaded()
	 		.then(function() { return pushPosts(db, postsArr); });
	}

	function pushPosts(db, postsArr) {
		db.$value = postsArr;
		return db.$save(); // returns ref to object set
	}

	function updatePost(postKey, obj) {
		try {
			if (arguments.length !== 2 || typeof postKey !== 'string' ||
				typeof obj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var postRef = ref.child('/' + postKey);
		var post = $firebaseObj(postRef);
		post = obj;
		return post.$save();
	}

	function removePost(postKey) {
		try {
			if (arguments.length !== 1 || typeof postKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		var postRef = ref.child('/' + postKey);
		return $firebaseObj(postRef).$remove();
	}
}

})();