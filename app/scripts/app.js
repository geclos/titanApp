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
	'firebase',
	'ngMaterial'
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
	  controller: 'mainCtrl',
	  controllerAs: 'vm',
	  resolve: {
		auth : requireAuth
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
  $rootScope.$on('$routeChangeError',
  	function(event, current, prev, error) {
		if (error === 'AUTH_REQUIRED') {
		  $log.info(error);
		  $location.path('/welcome');
		}
  });
}

function requireAuth($q, Auth, Account, Feed) {
	return Auth.requireAuth(true)
		.then(function(userKey) {
			return Account.getAccount(userKey)
				.then(function() {return Feed.start(userKey);});
		});
	// Firebase implementation
	/*
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
	*/
}

})();
