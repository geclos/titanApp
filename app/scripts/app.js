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
requireAuth.$inject = ['Auth','Account', 'Feed', 'Post'];

function routeProvider($routeProvider) {
  $routeProvider
	.when('/', {
	  templateUrl: 'views/main.html',
	  controllerAs: 'vm',
	  controller: 'mainCtrl',
	  resolve: {/* @ngInject */
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

function requireAuth(Auth, Account, Feed, Post) {
	return Auth.requireAuth(true)
		.then(function(accountKey) {
			Account.startService(accountKey);
			Feed.startService(accountKey);
			Post.startService(accountKey);
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
