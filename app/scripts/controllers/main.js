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
	'Account', 
	'currentAuth', 
	'Feed'
  ];

function mainCtrl ($log, Account, currentAuth, Feed) {
	try	{
		if (!currentAuth) {
			throw new Error('Not authenticated');
		} else {
			var user = currentAuth;
		}
	} catch(e) {
		$log.error(e);
	}

	/* jshint validthis: true */
	var vm = this;
	// TODO : initialize account & feeds before loading the controller
	vm.account;
	vm.feeds;

}
})();