(function () {
'use strict';

/**
 * @ngdoc overview
 * @name titanApp
 * @description
 * # titanApp
 *
 * Main module of the application.
 */
angular.module('titanApp', [
	'ngAnimate',
	'ngMessages',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'firebase'
  ])
  .run(redirectFallback)
  .config(routeProvider);

redirectFallback.$inject = ['$log', '$rootScope', '$location'];
routeProvider.$inject = ['$routeProvider', 'Auth'];

function routeProvider($routeProvider) {
  $routeProvider
	.when('/', {
	  templateUrl: 'views/main.html',
	  controller: 'MainCtrl',
	  controllerAs: 'vm',
	  resolve: {
		currentAuth : function() { return Auth.requireAuth(true); }]
		// TODO...
	  }
	})
	.otherwise({
	  redirectTo: '/'
	});
}

function redirectFallback($log, $rootScope, $location) {
  $rootScope.$on('$routeChangeError', 
	function(event, next, previous, error) { redirect(error); });

  function redirect(error) {
	if (error === 'AUTH_REQUIRED') {
	  $log.error(error);
	  $location.path('/');
	}
  }
}

})();