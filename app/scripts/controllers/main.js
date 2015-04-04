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
	vm.requestFeedUpdate = requestFeedUpdate;
	vm.subscriptions = getSubscriptions();
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;
	vm.toggleSelectedFeed = toggleSelectedFeed;

	function addFeed(feedUrl, category) {
		vm.addingFeed = true;
		feedCat = category ? category : null; //TODO...
		XMLParser.retrieveFeed(feedUrl)
			.then(setFeed)
			.then(setPosts)
			.then(setSubscription)
			.then(addFeedSuccess)
			.catch(function(e) { $log.error(e); });
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

	function toggleSelectedFeed(feedKey) {
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
		return Feed.lastUpdated(feedKey)
			.then(function(data) {
				var lastUpdate = data.$value;
				var timeElapsed = Date.now() - lastUpdate;
				timeElapsed = new Date(timeElapsed); 
				if (timeElapsed.getUTCMinutes() > 60) {
					updateFeed()
						.then(feedUpdateSuccess)
						.catch(function(e) {$log.error(e);});
				} else {
					$log.info('Feed is up to date. Last update: ' + new Date(lastUpdate));
				}
			});
	}

	function updateFeed() {
		return XMLParser.retrieveFeed(feedKey)
			.then(function(feedObj) { return Post.setPosts(feedKey, feedObj.entries); })
			.then(function() { return Feed.updateFeed(feedKey, {'lastUpdate': Date.now()}); });
	}

	function feedUpdateSuccess() {
		$log.info(feedKey + ' was succesfully updated.');
		return true;
	}
}

})();