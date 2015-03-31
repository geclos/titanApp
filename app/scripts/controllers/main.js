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
	var feedKey, feedCat, googleFeedObj;

	vm.addFeed = addFeed;
	vm.displayPosts = displayPosts;
	vm.subscriptions = getSubscriptions();
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;

	function addFeed(feedUrl, category) {
		vm.addingFeed = true;
		feedCat = category ? category : null;
		XMLParser.retrieveFeed(feedUrl)
			.then(setFeed)
			.then(setPost)
			.then(updateAccount)
			.then(addFeedSuccess(feedKey))
			.catch(function(e) { $log.error(e); });
	}

	function setFeed(obj) {
		googleFeedObj = obj;
		return Feed.setFeed(googleFeedObj);
	}

	function setPost(key) {
		feedKey = key;
		return Post.setPost(feedKey, googleFeedObj.entries);
	}

	function updateAccount() {
		return Account.setFeed(feedKey);
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
		Post.getPost(feedKey)
			.then(function(data) { 
				vm.selected = feedKey; 
				vm.posts = data; 
			});
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
		return $mdSidenav('right').toggle();
	}
}

})();