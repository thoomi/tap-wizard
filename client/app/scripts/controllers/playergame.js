'use strict';

angular.module('clientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gameData) {

    $scope.cards = [];
    $scope.currentRound = 0;
    $scope.notification = "Waiting for the host to start the game!";

    $scope.isGuessTricksDisabled = true;

    socket.on('newHandCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('beginNewGame', function(data) {
      $scope.notification = "Game is running!";
    });

    socket.on('cardNotAllowed', function(card) {
      $scope.cards.push(card);
    });

    socket.on('startNewRound', function(round) {
      $scope.currentRound = round;
      $scope.isGuessTricksDisabled = false;
    });


    $scope.throwCard = function(card) {
      // Send card to server
      var data = { gameId : gameData.gameId, card : card };
      socket.emit('playerThrowCard', data);

      // Remove card from array
      for (var indexOfCard = 0; indexOfCard < $scope.cards.length; indexOfCard++) {
            if($scope.cards[indexOfCard].color === card.color && $scope.cards[indexOfCard].value === card.value) {
                $scope.cards.splice(indexOfCard, 1);
            }
        }
    }

    $scope.guessNumberOfTricks = function(number) {
      var data = { gameId : gameData.gameId, guessedTricks : number };
      socket.emit('playerGuessTricks', data);
      $scope.isGuessTricksDisabled = true;
    }

    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

    $scope.range = function(n) {
        return new Array(n);
    };
  });
