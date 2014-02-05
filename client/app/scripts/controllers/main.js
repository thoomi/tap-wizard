'use strict';

angular.module('clientApp')
    .controller('MainCtrl', function ($scope) {
        $scope.game = {
          start: 'new game',
          join: 'join game'
        };
    });
