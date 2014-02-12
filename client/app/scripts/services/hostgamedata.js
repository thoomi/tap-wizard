'use strict';

angular.module('clientApp')
  .factory('hostGameData', function () {
    var gameId       = 0;
    var players      = [];
    var currentRound = 1;
    var maxRounds    = 20;

    function findPlayerById(playerId) {
      for (var indexOfPlayer = 0; indexOfPlayer < players.length; indexOfPlayer++) {
            if(players[indexOfPlayer].playerId === playerId) {
                return players[indexOfPlayer];
            }
        }
    }

    // Public API here
    return {
      gameId          : gameId,
      players         : players,
      currentRound    : currentRound,
      maxRounds       : maxRounds,
      numberOfPlayers : players.length,
      findPlayerById  : findPlayerById
    };
  });
