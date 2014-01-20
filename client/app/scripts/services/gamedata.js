'use strict';

angular.module('clientApp')
  .factory('gameData', function () {
    var playerName = 'Player';
    var gameId = 0;

    // Public API here
    return {
        playerName: playerName,
        gameId: gameId
      };
  });
