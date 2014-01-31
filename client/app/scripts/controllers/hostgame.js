'use strict';

angular.module('clientApp')
  .controller('HostgameCtrl', function ($scope, socket, hostGameData) {
    $scope.gameId       = hostGameData.gameId;
    $scope.players      = hostGameData.players;
    $scope.cards        = [];
    $scope.round        = { current: hostGameData.currentRound, max: hostGameData.maxRounds };
    $scope.trickwinner  = '';
    $scope.trumpCard    = {};

    socket.on('playerHasThrownCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('newTrumpCard', function(card) {
      $scope.trumpCard = card;
      console.log(card);
    });

    socket.on('playerGuessedTricks', function(data) {
      hostGameData.findPlayerBySocketId(data.socketId).guessedTricks = data.guessedTricks;
    });

    socket.on('playerHasWonTrick', function(name) {
      $scope.trickwinner = name;
      $scope.cards = [];
    });

    socket.on('roundIsOver', function(data) {
      $scope.round.current++;
      $scope.trickwinner = '';
      $scope.trumpCard = {};
    });

    $scope.dealCards = function() {
      socket.emit('hostStartRound', hostGameData.gameId);
    };

    $scope.range = function(n) {
        return new Array(n);
    };
});
