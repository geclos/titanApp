'use strict';

/**
 * @ngdoc function
 * @name titanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the titanApp
 */
angular.module('titanApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
