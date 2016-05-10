'use strict';

/**
 * @ngdoc overview
 * @name dayspringApp
 * @description
 * # dayspringApp
 *
 * Main module of the application.
 */
angular
  .module('dayspringApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/donation.html',
        controller: 'DonationCtrl',
        controllerAs: 'donation'
      })
      .when('/message', {
        templateUrl: 'views/message.html',
        controller: 'MessageCtrl',
        controllerAs: 'message'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

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
    }
  ]);
