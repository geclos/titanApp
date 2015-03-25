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
			var updatedFeed = new google.feeds.Feed(feedUrl); //jshint ignore:line
			// Retrieves feed content from Google API
			updatedFeed.load(function (result) {
				if (!result.error) {
					deferred.resolve(result.feed);
				} else {
					deferred.reject('The URL provided is not valid: ' + 
						result.error.code + ' - ' + 
						result.error.message);
				}
			});

			return deferred.promise;
		}
	}
})();