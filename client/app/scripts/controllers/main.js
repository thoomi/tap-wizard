'use strict';

angular.module('clientApp')
    .controller('MainCtrl', function ($scope) {
        $scope.game = {
          start: 'Start a new game',
          join: 'Join an existing game'
        };
    });
