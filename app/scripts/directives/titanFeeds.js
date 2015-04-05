(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.directive('titanFeeds', titanFeedsDirective);

titanFeedsDirective.$inject = ['$log'];

function titanFeedsDirective($log) {
	var directive = {
		// controller: controller,
		// controllerAs: 'feeds', 
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: true,
		templateUrl: '../views/directives/titan-feeds.html'
		// link: function($scope, iElm, iAttrs, controller) {}
	};
	
	return directive;

	function controller($scope) {
		/* jshint validthis: true */
		var feeds = this;
	}
}
	
})();