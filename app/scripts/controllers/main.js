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
	'$q',
	'$timeout',
	'$mdSidenav',
	'Account',
	'Feed',
	'Post',
	'XMLParser'
  ];

/* @ngInject */
function mainCtrl($q, $timeout, $mdSidenav, Account, Feed, Post, XMLParser) {
	/* jshint validthis: true */
	var vm = this;

	vm.addFeed = addFeed;
	vm.loadFeed = loadFeed;
	vm.popUp = {};
	vm.requestFeedUpdate = requestFeedUpdate;
	vm.subscriptions = getSubscriptions();
	vm.toggleAddFeedForm = toggleAddFeedForm;
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;

	function addFeed(feedUrl, category) {
		vm.addingFeed = true;
		return XMLParser.retrieveFeed(feedUrl)
			.then(asyncOperations)
			.then(addFeedSuccess);
	}

	function asyncOperations(googleFeedObj) {
		var promises = [];
		promises.push(setFeed(googleFeedObj), 
			setSubscription(googleFeedObj.title), 
			setPosts(googleFeedObj.title, googleFeedObj));
		return $q.all(promises);
	}

	function setFeed(feedObj) {
		return Feed.setFeed(feedObj);
	}

	function setPosts(feedKey, feedObj) {
		return Post.setPosts(feedKey, feedObj.entries);
	}

	function setSubscription(feedKey) {
		return Account.setSubscription(feedKey);
	}
	
	function addFeedSuccess(results) {
		var feedKey = results[2];
		vm.popUp.message = feedKey + ' was succesfully added.';
		vm.togglePopUp();
		vm.toggleAddFeedForm();
		delete vm.feedUrl;
		delete vm.addingFeed;
		vm.form.$setPristine();
		vm.form.$setUntouched();
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
				.then(function() { return loadFeed(feedTitle); })
				.then(feedUpdateSuccess);
		} else {
			vm.popUp.message = 'Feed is up to date. Last update: ' + new Date(lastUpdate);
			vm.togglePopUp();
		}
	}
	
	function updateFeed() {
		return XMLParser.retrieveFeed(vm.feed.link)
			.then(asyncUpdate);
	}

	function feedUpdateSuccess() {
		vm.popUp.message = vm.feed.title + ' was succesfully updated.';
		vm.togglePopUp();
		return true;
	}

	function asyncUpdate(feedObj) { 
		var promises = [];
		promises.push(Feed.updateFeed(vm.feed.title, {lastUpdate : Date.now()}), 
			Post.setPosts(vm.feed.title, feedObj.entries));
		return $q.all(promises);
	}

	function toggleAddFeedForm(ev) {
		if (!ev || ev && ev.keyCode === 27) {
			vm.addFeedForm = vm.addFeedForm ? false : true;
			vm.form.$setPristine();
			vm.form.$setUntouched();
			vm.form.feedUrl.$setViewValue('');
			return true;
		} else {
			return false;
		}
	}

	function togglePopUp(ev) {
		if (vm.popUp.show) {
			return $timeout(timeOutPopUp, 3000);
		} else {
			vm.popUp.show = true;
			return $timeout(timeOutPopUp, 3000);
		}
	}

	function timeOutPopUp() {
		delete vm.popUp.show;
		return true;
	}

	function loadFeed(feedKey) {
		vm.selected = feedKey;
		vm.loadingFeed = true;
		var promises = [];
		promises.push(getFeed(feedKey), getPosts(feedKey));
		return $q.all(promises).then(displayResults);
	}

	function getFeed(feedKey) {
		return Feed.getFeed(feedKey);
	}
	
	function getPosts(feedKey) { 
		return Post.getPost(feedKey);
	}
	
	function displayResults(results) {
		vm.feed = results[0];
		vm.posts = results[1];
		delete vm.loadingFeed;
		return true; 
	}

	function toggleRight() {
		return $mdSidenav('right').toggle();
	}
}

})();