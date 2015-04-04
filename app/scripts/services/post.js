(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.service('Post', postService);

postService.$inject = ['$q', '$log', '$firebaseObject', 
'$firebaseArray', 'FIREBASE_URL'];

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
		setPosts : setPosts,
		removePost : removePost
	};

	return service;

	function cleanHTML(content) {
		content = content.replace(/<br>|\/n|<img.+?>|<p><\/p>/gi, '');
		return content.slice(content.indexOf('<'), 
			content.lastIndexOf('>') + 1);  
	}
	

	function getPost(feedKey, postKey) {
		try {
			if (arguments.length > 2 || 
				arguments.length === 1 && 
				typeof feedKey !== 'string') {
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
			return $firebaseArr(postsRef).$loaded()
				.then(function(feedsArr) { return feedsArr.slice(0, feedsArr.length - 1); });
		}
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

	function setPosts(feedKey, entriesArr) {
		try {
			if (arguments.length !== 2 ||
				entriesArr.constructor !== Object &&
				entriesArr.constructor !== Array) {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {
			$log.error(e);
		}

		console.log(entriesArr);
		var post;
		var deferred = $q.defer();
		var lastDatePublishedRef = ref.child(feedKey + '/lastDatePublished');
		var lastDatePublished = $firebaseObj(lastDatePublishedRef).$value;
		var childRef = ref.child(feedKey);
		if (lastDatePublished) {
			entriesArr.forEach(function(entry, i) {
			 	post = new Post(entry);
			 	if (post.publishedDate > lastDatePublished) {
					childRef.push(post, function(e) { 
				 		if (e) {
				 			deferred.reject(e);
				 		} else if (!e && i === entriesArr.length - 1) {
				 			deferred.resolve();
				 		}
				 	});
			 	}
			});
		} else {
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
		}
		var setNewLastDate = childRef.child('lastDatePublished')
			.set(Date.parse(entriesArr[0].publishedDate), function(e) {
				if (e) {
					$log.error(e);
				}
			});
		
		return deferred.promise;
	}

	function startService(data) {
		accountKey = data;
		ref = new Firebase(FIREBASE_URL + // jshint ignore:line 
		'/posts/' + accountKey); 
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
			if (imgSrc.indexOf('.gif') > -1 || 
				imgSrc.indexOf('.img')  > -1) {
				return null;
			} else {
				return imgSrc;
			}
		} else {
			return null;
		}
	}
}

})();