'use strict';

/**
 * @ngdoc function
 * @name dayspringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dayspringApp
 */
angular.module('dayspringApp')
  .controller('DonationCtrl', ['$scope', function ($scope) {
    showName();

    window.refreshController = function () {
      showName();
      $scope.$apply();
    }

    function showName () {
      if (localStorage.name) {
        $scope.name = localStorage.name;
        $('#name i').addClass('active');
        $('#name label').addClass('active');
      }
    }
  }]);
