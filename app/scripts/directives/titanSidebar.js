(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.directive('titanSidebar', titanSidebarDirective);

titanSidebarDirective.$inject = [];

function titanSidebarDirective(){
	var directive = {
		controller: controller,
		controllerAs: 'vm',
		bindToController: true, 
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: '../views/directives/titan-sidebar.html',
		replace: true
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