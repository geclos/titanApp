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

/* @ngInject */
function postService($q, $log, $firebaseObj, $firebaseArr, FIREBASE_URL) {
	var ref, accountKey;
	var Post = function (postObj) {
		this.title = postObj.title;
		this.link = postObj.link;
		this.author = postObj.author;
		this.mainImg = stripImg(postObj.content);
		this.content = cleanHTML(postObj.content);
		this.contentSnippet = postObj.contentSnippet;
		this.publishedDate = Date.parse(postObj.publishedDate);
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
	

	function getPost(feedKey, postProp) {
		// REVIEW...
		try {
			if (arguments.length > 2 || 
				arguments.length === 1 && 
				typeof feedKey !== 'string') {
				throw new Error('Arguments do not match specification');
			}
		} catch(e) {

			$log.error(e);
		}

		if (postProp) {
			var postRef = ref.child('/' + feedKey + '/' + postProp);
			return $firebaseObj(postRef).$loaded();
		} else {
			var postsRef = ref.child('/' + feedKey).orderByChild('publishedDate');
			return $firebaseArr(postsRef).$loaded()
				.then(function(feedsArr) { return feedsArr.slice(1).reverse(); });
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

		return getPost(feedKey, 'lastDatePublished')
			.then(function(data) {return handlePostsCreation(data, feedKey, entriesArr);})
			.catch(function(e) {$log.error(e);});		
	}

	function handlePostsCreation(data, feedKey, entriesArr) {
		if (data.$value) {
			return updatePosts(data.$value, feedKey, entriesArr);
		} else {
			return createPosts(feedKey, entriesArr);
		}
	}

	function updatePosts(lastDatePublished, feedKey, entriesArr) {
		var post;
		var postsArr = [];
		var deferred = $q.defer();
		var childRef = ref.child(feedKey);
		for (var i = 0; i <= entriesArr.length - 1; i++) {
		 	post = new Post(entriesArr[i]);
		 	if (post.publishedDate > lastDatePublished) {
				postsArr.push(post);
		 	} else {
		 		break;
		 	}
		}
		if (postsArr.length > 0) {
			postsArr.forEach(function(post, i) {
				childRef.push(post, function(e) { 
					 		if (e) {
					 			deferred.reject(e);
					 		} else if (i === postsArr.length - 1) {
					 			deferred.resolve(childRef.key());
								var setNewLastDate = childRef.child('lastDatePublished')
									.set(postsArr[0].publishedDate, 
										function(e) {
											if (e) {$log.error(e);}
										});
					 		}
					 	});
			});
		} else {
			deferred.resolve(childRef.key());
		}

		return deferred.promise;
	}

	function createPosts(feedKey, entriesArr) {
		var post;
		var deferred = $q.defer();
		var childRef = ref.child(feedKey);
		entriesArr.forEach(function(entry, i) {
		 	post = new Post(entry);
			childRef.push(post, function(e) { 
		 		if (e) {
		 			deferred.reject(e);
		 		} else if (i === entriesArr.length - 1) {
		 			deferred.resolve(childRef.key());
					var setNewLastDate = childRef.child('lastDatePublished')
						.set(Date.parse(entriesArr[0].publishedDate), 
							function(e) {
								if (e) {$log.error(e);}
							});
		 		}
		 	});
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