'use strict';

/**
 * @ngdoc function
 * @name dayspringApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the dayspringApp
 */
angular.module('dayspringApp')
  .controller('MessageCtrl', ['$scope', '$firebaseArray',
    function ($scope, $firebaseArray) {
      var ref = new Firebase('https://dayspring-hackathon.firebaseio.com/');
      $scope.messages = $firebaseArray(ref);
      $scope.addMessage = function(e) {
        if ($scope.msg) {
          var name = $scope.name || 'anonymous';

          //ADD TO FIREBASE
          $scope.messages.$add({
            from: name,
            body: $scope.msg
          });

          //RESET MESSAGE
          $scope.msg = "";
        }
      };
    }
  ]);
