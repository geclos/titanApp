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
	'Auth', 
	'Account',
	'Feed',
	'XMLParser',
	'$mdSidenav'
  ];

function mainCtrl($log, Auth, Account, Feed, XMLParser, $mdSidenav) {
	/* jshint validthis: true */
	var vm = this;
	
	vm.addFeed = addFeed;
	// vm.getFeed = getFeed;
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;
	vm.closePopUp = closePopUp;

	function addFeed(feedUrl) {
		XMLParser.retrieveFeed(feedUrl)
			.then(function(feedObj) { Feed.setFeed(feedObj); })
			.then(function(ref) { addFeedSuccess(ref.key()); });
	}

	function addFeedSuccess(feedKey) {
		$log.info(feedKey + ' Succesfully added.');
	}

	function togglePopUp() {
		vm.popUp = vm.popUp ? false : true;
	}

	function toggleRight() {
		$mdSidenav('right').toggle();
	}

	function closePopUp(e) {
		if (e.keyCode === 27) {
			vm.togglePopUp();
		}
	}
}

})();