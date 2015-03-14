(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('GoogleParser', googleParserService);

	googleParserService.$inject = ['$http'];

	function googleParserService($http) {
		var service = {
			retrieveFeed: publicRetrieveFeed
		  };

		return service;

		function publicRetrieveFeed(feedUrl) {
			var deferred = $q.defer();
			var config = {
				responseType: 'XML',
				timeout: '5000'
			  };
			$http.get(feedUrl, { responseType: 'XML' })
				.success(function(data, status) {})
				.error(function(e) {});
			
			return deferred.promise;
		}
	}
})();