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
routeProvider.$inject = ['$routeProvider'];
requireAuth.$inject = ['$q', 'Auth', 'Account', 'Feed'];

function routeProvider($routeProvider) {
  $routeProvider
	.when('/', {
	  templateUrl: 'views/main.html',
	  controller: 'MainCtrl',
	  controllerAs: 'vm',
	  resolve: {
		requireAuth : requireAuth
	  }
	})
	.when('/welcome', {
		templateUrl: 'views/welcome.html',
		controller: 'welcomeCtrl',
		controllerAs: 'vm'
	})
	.otherwise({
	  redirectTo: '/'
	});
}

function redirectFallback($log, $rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(event, next, previous, error) { 
	if (error === 'AUTH_REQUIRED') {
	  $log.info(error);
	  $location.path('/welcome');
	}
  }); 
}

function requireAuth($q, Auth, Account, Feed) {
	var deferred = $q.defer();
	Auth.requireAuth(true)
		.then(function (authData) {
			Account.getAccount()
				.then(Feed.start(authData))
				.then(function() { deferred.resolve(authData); });
			}
		)
		.catch(function(e) { deferred.reject(e); });

	return deferred.promise;
}	

})();