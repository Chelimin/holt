'use strict';

/**
 * @ngdoc function
 * @name dayspringApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the dayspringApp
 */
angular.module('dayspringApp')
  .controller('MessageCtrl', ['$scope', '$firebaseArray', '$location', '$anchorScroll',
    function ($scope, $firebaseArray, $location, $anchorScroll) {
      $('.carousel').carousel();
      $('.slider').slider({full_width: true});
      $anchorScroll();

      var ref = new window.Firebase('https://dayspring-hackathon.firebaseio.com/');
      $scope.messages = $firebaseArray(ref);
      $scope.addMessage = function() {
        $location.hash('gallery');
         $anchorScroll();

        if ($scope.msg) {
          var name = $scope.name || 'anonymous';

          //ADD TO FIREBASE
          $scope.messages.$add({
            from: name,
            body: $scope.msg,
            user_id: localStorage.id || 558978353,
            amount: localStorage.amount || 5000,
            image_url: "http://lorempixel.com/580/250/nature/1"
          });

          //RESET MESSAGE
          $scope.msg = "";
        }
      };

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

      setTimeout(function () {
        if (window.FB) {
          FB.XFBML.parse();
        }
      }, 3000);
    }
  ]);
