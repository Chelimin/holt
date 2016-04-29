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
        message.hidden = true;
        $scope.messages.$save(message);
      };

      $scope.totalAmount = function () {
        var total = 0;
        $scope.messages.forEach(function (msg) {
          total += parseFloat(msg.amount);
        });
        return total;
      };

      $scope.postToFacebook = function (message) {
        FB.api(
          '/me/accounts',
          function (response) {
            var page = response.data[0];
            var fbPost = message.body + '\n\nFrom: ' + message.from;
            FB.api(
              '/' + page.id + '/feed',
              'POST',
              {
                message: fbPost,
                access_token: page.access_token
              },
              function (data) {
                console.log(data);
              }
            );
          }
        );
      };
    }
  ]);
