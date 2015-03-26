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
		controller: controller,
		bindToController: true, 
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: '../views/directives/titan-feeds.html'
		// link: function($scope, iElm, iAttrs, controller) {}
	};
	
	return directive;

	function controller($scope, $element, $attrs, $transclude) {
		/* jshint validthis: true */
		var vm = this;
		
		// TODO...
	}
}
	
})();