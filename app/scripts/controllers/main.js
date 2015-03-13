(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name titanApp.controller:MainCtrl
	 * @description
	 * # MainCtrl
	 * Controller of the titanApp
	 */
	angular.module('titanApp').controller('MainCtrl', mainCtrl);

	mainCtrl.$inject('Account', 'AuthCurrent', 'Feed');
	
	function mainCtrl (Account, AuthCurrent, Feed) {
		// body...
	}
})();