'use strict';

angular.module('clientApp')
  .factory('hostGameData', function () {
    var gameId  = 0;
    var players = [];
    var maxNumberOfCards = 60;

    // Public API here
    return {
      gameId  : gameId,
      players : players,
      maxNumberOfCards : maxNumberOfCards
    };
  });
