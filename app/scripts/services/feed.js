(function () {
	'use strict';
	
	/**
	* titanApp Module
	*
	* Description
	*/
	angular.module('titanApp').factory('Feed', feedService);

	function feedService() {
		return {
			getFeed : getFeed
		};

		function getFeed() {
			return 'Hello World!'; 
		}
	}
})();