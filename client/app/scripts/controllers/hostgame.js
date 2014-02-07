'use strict';

angular.module('clientApp')
  .controller('HostgameCtrl', function ($scope, socket, hostGameData, $timeout) {
    $scope.gameId       = hostGameData.gameId;
    $scope.players      = hostGameData.players;
    $scope.cards        = [];
    $scope.round        = { current: hostGameData.currentRound, max: hostGameData.maxRounds };
    $scope.trickwinner  = '';
    $scope.trumpCard    = {};
    $scope.scores       = [];


    $scope.isStartRoundDisabled = false;

    socket.on('playerHasThrownCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('newTrumpCard', function(card) {
      $scope.trumpCard = card;
    });

    socket.on('playerGuessedTricks', function(data) {
      $scope.scores[$scope.round.current][data.socketId] = {};
      $scope.scores[$scope.round.current][data.socketId].guessedTricks = data.guessedTricks;
      //hostGameData.findPlayerBySocketId(data.socketId).guessedTricks = data.guessedTricks;
    });

    socket.on('playerHasWonTrick', function(name) {
      $scope.trickwinner = name;
      $timeout(function() {
        $scope.cards = [];
        console.log('executed');
      },8000);
    });

    socket.on('roundIsOver', function(points) {
      $scope.trumpCard = {};

      for (var indexOfPlayer = 0; indexOfPlayer < $scope.players.length; indexOfPlayer++) {
        var socketId     = $scope.players[indexOfPlayer].socketId
        var currentScore = $scope.players[indexOfPlayer].points;
        var scoreToAdd   = points[socketId];

        $scope.scores[$scope.round.current][socketId].score = currentScore + scoreToAdd;
        $scope.players[indexOfPlayer].points = currentScore + scoreToAdd;
      }

      $scope.round.current++;
      $scope.isStartRoundDisabled = false;
    });

    $scope.startRound = function() {
      $scope.isStartRoundDisabled = true;
      $scope.scores[$scope.round.current] = {};
      $scope.trickwinner = '';

      socket.emit('hostStartRound', hostGameData.gameId);
    };

    $scope.range = function(n) {
        return new Array(n);
    };
});
