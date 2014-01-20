'use strict';

angular.module('clientApp')
  .controller('JoingameCtrl', function ($scope, $location, gameData) {
    $scope.joinGameText = 'Join';

    $scope.setData = function() {
      gameData.playerName = $scope.playerName;
      gameData.gameId = $scope.gameId;

      $location.path('playergame');
    }
  });
