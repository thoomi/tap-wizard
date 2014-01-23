'use strict';

angular.module('clientApp')
  .factory('hostGameData', function () {
    var gameId       = 0;
    var players      = [];
    var currentRound = 1;
    var maxRounds    = 0;

    // Public API here
    return {
      gameId          : gameId,
      players         : players,
      currentRound    : currentRound,
      maxRounds       : maxRounds,
      numberOfPlayers : players.length
    };
  });
