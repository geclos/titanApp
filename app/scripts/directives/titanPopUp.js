(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.directive('titanPopUp', titanPopUpDirective);

titanPopUpDirective.$inject = [];

function titanPopUpDirective(){
	var directive = {
		controller: controller,
		controllerAs: 'popup', 
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
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