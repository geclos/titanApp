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
		controllerAs: 'sidebar',
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: '../views/directives/titan-sidebar.html',
		replace: true
		// link: function($scope, iElm, iAttrs, controller) {}
	};
	
	return directive;
	
	function controller() {
		/* jshint validthis: true */
		var sidebar = this;

		// TODO...
	}
}

})();