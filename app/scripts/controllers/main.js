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
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;
	vm.addFeed = addFeed;

	function addFeed(feedUrl) {
		vm.addingFeed = true;
		XMLParser.retrieveFeed(feedUrl)
			.then(function(feedObj) { 
				return Feed.setFeed(feedObj)
				.then(function(ref) { return Post.setPost(ref.key(), feedObj.entries); })
				.then(function(ref) { addFeedSuccess(ref.key()); });
			})
			.catch(function(e) { $log.error(e); });
	}

	function addFeedSuccess(feedKey) {
		$log.info(feedKey + ' Succesfully added.');
		vm.togglePopUp();
		delete vm.feedUrl;
		delete vm.addingFeed;
		vm.form.$setPristine();
		vm.form.$setUntouched();
	}

	function togglePopUp(ev) {
		if (!ev || ev && ev.keyCode === 27) {
			vm.popUp = vm.popUp ? false : true;
			vm.form.$setPristine();
			vm.form.$setUntouched();
			vm.form.feedUrl.$setViewValue("");
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