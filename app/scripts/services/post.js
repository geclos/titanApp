(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Post', postService);

postService.$inject = ['$q', '$log', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];

function postService($q, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var ref, accountKey;
	var Post = function (postObj) {
		this.title = postObj.title;
		this.link = postObj.link;
		this.author = postObj.author;
		this.mainImg = stripImg(postObj.content);
		this.content = cleanHTML(postObj.content);
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
			if (arguments.length > 2 || arguments.length === 1 && typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		if (postKey) {
			var postRef = ref.child('/' + feedKey + '/' + postKey);
			return $firebaseObj(postRef).$loaded();
		} else {
			var postsRef = ref.child('/' + feedKey);
			return $firebaseArr(postsRef).$loaded();
		}
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
		var deferred = $q.defer();
		var childRef = ref.child(feedKey);
		entriesArr.forEach(function(entry, i) {
		 	post = new Post(entry);
			childRef.push(post, function(e) { 
		 		if (e) {
		 			deferred.reject(e);
		 		} else if (!e && i === entriesArr.length - 1) {
		 			deferred.resolve();
		 		}
		 	});
		});

		return deferred.promise;
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

	function stripImg(content) {
		var imgIndex = content.indexOf('<img');
		if ( imgIndex !== -1) {
			var mainImg = content.match(/<img.+?>/);
			var el = document.createElement('div'); 
			el.innerHTML = mainImg;
			mainImg = el.getElementsByTagName('img');
			el.remove();
			var imgSrc = mainImg[0].getAttribute('src');
			if (imgSrc.indexOf('.gif') > -1 || imgSrc.indexOf('.img')  > -1) {
				return null;
			} else {
				return imgSrc;
			}
		} else {
			return null;
		}
	}

	function cleanHTML(content) {
		content = content.replace(/<br>|\/n|<img.+?>|<p><\/p>/gi, '');
		return content.slice(content.indexOf('<'), content.lastIndexOf('>') + 1);  
	}
}

})();