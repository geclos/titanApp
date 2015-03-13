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
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'vm',
          resolve: {
            AuthCurrent: function () { return Auth.login(); }
          }
        })
        .otherwise({
          redirectTo: '/'
        });
    });
})();