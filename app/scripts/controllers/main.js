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
		feedCat = category ? category : null; //TODO...
		XMLParser.retrieveFeed(feedUrl)
			.then(setFeed)
			.then(setPost)
			.then(setSubscription)
			.then(addFeedSuccess)
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

	function setSubscription() {
		return Account.setSubscription(feedKey);
	}

	function addFeedSuccess() {
		$log.info(feedKey + ' was succesfully added.');
		vm.togglePopUp();
		delete vm.feedUrl;
		delete vm.addingFeed;
		vm.form.$setPristine();
		vm.form.$setUntouched();
		return true;
	}

	function getSubscriptions() {
		return Account.getSubscriptions();
	}

	function displayPosts(feedKey) {
		return Post.getPost(feedKey)
			.then(function(data) { 
				vm.selected = feedKey; 
				vm.posts = data;
				return true; 
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

	function requestFeedUpdate(feedTitle) {
		feedKey	= feedTitle;
		var lastUpdate = Feed.lastUpdated(feedKey);
		var timeElapsed = Date.now() - lastUpdate; 
		if (timeElapsed.getUTCHours() > 1) {
			updateFeed();
		}
	}

	function updateFeed() {
		Feed.updateFeed(feedKey, {name: 'lastUpdate', value: Date.now()});
			.then(updatePost)
			.then(updateFeedSuccess)
			.catch(function(e) {$log.error(e);});
	}

	function updatePost() {
		// TODO...
	}
}

})();