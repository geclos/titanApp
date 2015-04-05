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
	'Account',
	'Feed',
	'Post',
	'XMLParser'
  ];

/* @ngInject */
function mainCtrl($log, $mdSidenav, Account, Feed, Post, XMLParser) {
	/* jshint validthis: true */
	var vm = this;
	var feedKey, feedCat, googleFeedObj;

	vm.addFeed = addFeed;
	vm.requestFeedUpdate = requestFeedUpdate;
	vm.subscriptions = getSubscriptions();
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;
	vm.toggleSelectedFeed = toggleSelectedFeed;

	function addFeed(feedUrl, category) {
		vm.addingFeed = true;
		feedCat = category ? category : null; //TODO...
		return XMLParser.retrieveFeed(feedUrl)
			.then(setFeed)
			.then(setPosts)
			.then(setSubscription)
			.then(addFeedSuccess);
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

	function feedUpdateSuccess() {
		$log.info(feedKey + ' was succesfully updated.');
		return true;
	}

	function getSubscriptions() {
		return Account.getSubscriptions();
	}

	function requestFeedUpdate(feedTitle) {
		var lastUpdate = vm.feed.lastUpdate;
		var timeElapsed = Date.now() - lastUpdate;
		timeElapsed = Math.round(timeElapsed / 1000 / 60);
		if (timeElapsed > 60) {
			updateFeed()
				.then(feedUpdateSuccess);
		} else {
			$log.info('Feed is up to date. Last update: ' + 
				new Date(lastUpdate));
		}
	}

	function setFeed(obj) {
		googleFeedObj = obj;
		return Feed.setFeed(googleFeedObj);
	}

	function setPosts(key) {
		feedKey = key;
		return Post.setPosts(feedKey, googleFeedObj.entries);
	}

	function setSubscription() {
		return Account.setSubscription(feedKey);
	}

	function togglePopUp(ev) {
		if (!ev || ev && ev.keyCode === 27) {
			vm.popUp = vm.popUp ? false : true;
			vm.form.$setPristine();
			vm.form.$setUntouched();
			vm.form.feedUrl.$setViewValue('');
			return true;
		}
		return false;
	}

	function toggleSelectedFeed(key) {
		feedKey = key;
		vm.selected = key;
		vm.loadingFeed = true;
		vm.posts = true;
		return Feed.getFeed(feedKey)
			.then(displayPosts);
	}

	function displayPosts(feed) { 
		return Post.getPost(feedKey)
			.then(function(posts) {
				vm.feed = feed;
				vm.posts = posts;
				delete vm.loadingFeed;
				return true; 
			});
	}

	function toggleRight() {
		return $mdSidenav('right').toggle();
	}

	function updateFeed() {
		return XMLParser.retrieveFeed(vm.feed.link)
			.then(function(feedObj) { return Post.setPosts(vm.feed.title, feedObj.entries); })
			.then(function() { return Feed.updateFeed(vm.feed.title, {lastUpdate : Date.now()}); })
			.catch(function(e) {$log.error(e);});
	}
}

})();