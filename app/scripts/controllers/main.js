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
	vm.togglePopUp = togglePopUp;
	vm.toggleRight = toggleRight;

	function addFeed(feedUrl) {
		XMLParser.retrieveFeed(feedUrl)
			.then(function(feedObj) { 
				Feed.addFeed(feedObj)
					.then(function() { vm.feed = feedObj; });
			});
	}
	
	function togglePopUp() {
		vm.popUp = vm.popUp ? false : true;
	}

	function toggleRight() {
		$mdSidenav('right').toggle();
	}
}

})();