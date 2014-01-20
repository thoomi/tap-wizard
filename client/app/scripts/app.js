'use strict';

angular.module('clientApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/joingame', {
        templateUrl: 'views/joingame.html',
        controller: 'JoingameCtrl'
      })
      .when('/hostgame', {
        templateUrl: 'views/hostgame.html',
        controller: 'HostgameCtrl'
      })
      .when('/playergame', {
        templateUrl: 'views/playergame.html',
        controller: 'PlayergameCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


