(function () {
'use strict';

/**
 * @ngdoc function
 * @name titanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the titanApp
 */
angular.module('titanApp')
	.controller('MainCtrl', mainCtrl);

mainCtrl.$inject = [
	'$log',
	'Auth', 
	'Account',
	'Feed'
  ];

function mainCtrl ($log, Auth, Account, Feed) {

	/* jshint validthis: true */
	var vm = this;
	// TODO...
}
})();