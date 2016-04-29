'use strict';

/**
 * @ngdoc function
 * @name dayspringApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dayspringApp
 */
angular.module('dayspringApp')
  .controller('DashboardCtrl', ['$scope', '$firebaseArray',
    function ($scope, $firebaseArray) {
      var ref = new window.Firebase('https://dayspring-hackathon.firebaseio.com/');
      $scope.messages = $firebaseArray(ref);

      $scope.deleteMessage = function (message) {
        $scope.messages.$remove(message);
      };
    }
  ]);
