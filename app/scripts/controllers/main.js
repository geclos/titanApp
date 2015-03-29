(function() {
'use strict';

/**
 * @ngdoc function
 * @name titanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the titanApp
 */
angular.module('titanApp')
	.controller('mainCtrl', mainCtrl);

mainCtrl.$inject = [
	'$log',
	'$mdSidenav',
	'Auth',
	'Account',
	'Feed',
	'Post',
	'XMLParser'
  ];

function mainCtrl($log, $mdSidenav, Auth, Account, Feed, Post, XMLParser) {
	/* jshint validthis: true */
	var vm = this;
	// var form = $scope.form;

	// vm.categories;
	// vm.getFeed = getFeed;
	vm.subscriptions = getSubscriptions();
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;
	vm.addFeed = addFeed;
	vm.displayPosts = displayPosts;

	function addFeed(feedUrl, category) {
		vm.addingFeed = true;
		var feedKey, googleFeedObj;
		if (category) {
			var feedCat = category;
		}
		XMLParser.retrieveFeed(feedUrl)
			.then(function(obj) {
				googleFeedObj = obj;
				return Feed.setFeed(googleFeedObj);
			})
			.then(function(key) {
				feedKey = key;
				return Post.setPost(feedKey, googleFeedObj.entries);
			})
			.then(function() {
				return Account.setFeed(feedKey);
			})
			.then(function() { addFeedSuccess(feedKey); } )
			.catch(function(e) { $log.error(e); });
	}

	function addFeedSuccess(feedKey) {
		$log.info(feedKey + ' was succesfully added.');
		vm.togglePopUp();
		delete vm.feedUrl;
		delete vm.addingFeed;
		vm.form.$setPristine();
		vm.form.$setUntouched();
	}

	function getSubscriptions() {
		return Account.getSubscriptions();
	}

	function displayPosts(feedKey) {
		vm.posts = Post.getPost(feedKey);
	}

	function togglePopUp(ev) {
		if (!ev || ev && ev.keyCode === 27) {
			vm.popUp = vm.popUp ? false : true;
			vm.form.$setPristine();
			vm.form.$setUntouched();
			vm.form.feedUrl.$setViewValue('');
		}
	}

	function toggleRight() {
		$mdSidenav('right').toggle();
	}

	function closePopUp(ev) {
		if (ev.keyCode === 27) {
			vm.togglePopUp();
		}
	}
}

})();