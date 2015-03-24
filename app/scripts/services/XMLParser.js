(function() {
'use strict';

google.load('feeds', '1'); //jshint ignore:line
/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.factory('XMLParser', XMLParserService);

	XMLParserService.$inject = ['$log', '$q', '$http'];

	function XMLParserService($log, $q, $http) {
		var service = {
			retrieveFeed: retrieveFeed
		  };

		return service;

		function retrieveFeed(feedUrl) {
			var deferred = $q.defer();
			var config = {
				timeout: '5000'
			  };
			$http.get(feedUrl, config)
				.success(function(data, status) {
					deferred.resolve(data);
				})
				.error(function(e) {
					$log.error(e);
					deferred.reject(e);
				});
			
			return deferred.promise;
		}
	}
})();