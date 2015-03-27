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
	var ref, feedKey; 
	var Post = function (postObj) {
		this.title = postObj.title;
		this.link = postObj.link;
		this.author = postObj.author;
		this.content = postObj.content;
		this.contentSnippet = postObj.contentSnippet;
		this.datePublished = postObj.datePublished;
	};
	var service = {
		getPost : getPost,
		setPost : setPost,
		updatePost : updatePost,
		removePost : removePost
	};

	$rootScope.$on('feedSelected', function(data) {
		feedKey = data;
		ref = new Firebase(FIREBASE_URL + '/posts'); // jshint ignore:line
	});

	return service;

	function start(feedKey) {
	}

	function getPost(postKey) {
		try {
			if (arguments.length > 1 || arguments.length === 1 && typeof postKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		if (postKey) {
			var postRef = ref.child('/' + postKey);
			return $firebaseObj(postRef).$loaded();
		} else {
			return $firebaseArr(ref).$loaded();
		}
	}

	function setPost(postObj) {
		try {
			if (arguments.length !== 1 || typeof postObj !== 'object') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}
		
		var post = new Post(postObj);
		var db = $firebaseArr(ref);
		return db.$add(Post); // returns ref to object seted
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