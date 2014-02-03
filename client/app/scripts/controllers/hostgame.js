'use strict';

angular.module('clientApp')
  .controller('HostgameCtrl', function ($scope, socket, hostGameData) {
    $scope.gameId       = hostGameData.gameId;
    $scope.players      = hostGameData.players;
    $scope.cards        = [];
    $scope.round        = { current: hostGameData.currentRound, max: hostGameData.maxRounds };
    $scope.trickwinner  = '';
    $scope.trumpCard    = {};

    $scope.isStartRoundDisabled = false;

    socket.on('playerHasThrownCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('newTrumpCard', function(card) {
      $scope.trumpCard = card;
    });

    socket.on('playerGuessedTricks', function(data) {
      hostGameData.findPlayerBySocketId(data.socketId).guessedTricks = data.guessedTricks;
    });

    socket.on('playerHasWonTrick', function(name) {
      $scope.trickwinner = name;
      $scope.cards = [];
    });

    socket.on('roundIsOver', function(points) {
      $scope.round.current++;
      $scope.trickwinner = '';
      $scope.trumpCard = {};

      for (var indexOfPlayer = 0; indexOfPlayer < $scope.players.length; indexOfPlayer++) {
        var socketId = $scope.players[indexOfPlayer].socketId
        $scope.players[indexOfPlayer].points += points[socketId];
      }

      $scope.isStartRoundDisabled = false;
    });

    $scope.startRound = function() {
      $scope.isStartRoundDisabled = true;
      socket.emit('hostStartRound', hostGameData.gameId);
    };

    $scope.range = function(n) {
        return new Array(n);
    };
});
