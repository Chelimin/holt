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
            var page = _.filter(response.data, function (page) {
              return page.id === '577194379124444';
            })[0];
            var fbPost = message.body + '\n\nFrom: ' + message.from;
            FB.api(
              '/' + page.id + '/photos',
              'POST',
              {
                url: message.image_url,
                access_token: page.access_token,
                caption: fbPost
              },
              function (data) {
                message.postedToFb = true;
                $scope.messages.$save(message);
                swal('Yay!', 'Message posted to Facebook page!', 'success');
              }
            );
          }
        );
      };

      $scope.getFBProfileUrl = function (id) {
        return 'https://graph.facebook.com/' + id + '/picture?type=large';
      }
    }
  ]);
