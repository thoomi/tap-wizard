'use strict';

angular.module('clientApp', ['ngRoute','hmTouchEvents'])
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
      .when('/creategame', {
        templateUrl: 'views/creategame.html',
        controller: 'CreategameCtrl'
      })
      .when('/playergame', {
        templateUrl: 'views/playergame.html',
        controller: 'PlayergameCtrl'
      })
      .when('/hostgame', {
        templateUrl: 'views/hostgame.html',
        controller: 'HostgameCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


