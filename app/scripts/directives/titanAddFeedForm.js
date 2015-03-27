(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular.module('titanApp')
	.directive('titanAddFeedForm', titanAddFeedFormDirective);

titanAddFeedFormDirective.$inject = [];

function titanAddFeedFormDirective() {
	var directive = {
		controller: controller,
		restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
		// link: link
	};

	return directive;

	function controller($scope, $element, $attrs, $transclude) {
		/* jshint validthis: true */
		var addFeedForm = this;
		
		$scope.$watch(
			function() { return $scope.vm.popUp;},
			function() {
				if ($scope.vm.feedUrl) {
					delete $scope.vm.feedUrl;
				}
			}
		);
	}
}

})();