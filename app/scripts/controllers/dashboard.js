'use strict';

/**
 * @ngdoc function
 * @name dayspringApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dayspringApp
 */
angular.module('dayspringApp')
  .controller('DashboardCtrl', ['$scope', '$firebaseArray', '$anchorScroll',
    function ($scope, $firebaseArray, $anchorScroll) {
      var ref = new window.Firebase('https://dayspring-hackathon.firebaseio.com/');
      $scope.messages = $firebaseArray(ref);
      $anchorScroll();

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

      $scope.csv = function () {
          //  http://stackoverflow.com/questions/17836273/export-javascript-data
          //  -to-csv-file-without-server-interaction
          var twoDiArray = [];
          twoDiArray.push(['Name', 'Amount']);
          $scope.messages.forEach(function (msg) {
            twoDiArray.push([msg.from, msg.amount]);
          });

          var csvRows = [];
          for (var i = 0; i < twoDiArray.length; ++i) {
              for (var j = 0; j < twoDiArray[i].length; ++j) {
                  twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';
              }
              csvRows.push(twoDiArray[i].join(','));
          }

          var csvString = csvRows.join('\r\n');
          var $a = $('<a></a>', {
                  href: 'data:attachment/csv;charset=utf-8,' + escape(csvString),
                  target: '_blank',
                  download: 'donations.csv'
              });

          $('body').append($a[0]);
          $a.get(0).click();
          $a.remove();
      }

      $scope.orderByAmount = function (message) {
          return parseFloat(message.amount);
      };
    }
  ]);
