(function() {
'use strict';

/**
* titanApp Modulen
*
* Description
*/
angular.module('titanApp')
	.directive('titanStandardPopUp', titanStandardPopUpDirective);

	titanStandardPopUpDirective.$inject = [];

	function titanStandardPopUpDirective(){
		var directive = {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: '../views/standard-pop-up.html',
			replace: true,
			// transclude: true,
			// link: function($scope, iElm, iAttrs, controller) {}
		};

		return directive;
	}
})();