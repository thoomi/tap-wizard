'use strict';

angular.module('clientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gameData) {

    $scope.cards = [];

    $scope.cards.push({ suit: 'red', value: 13});

    $scope.currentRound = 0;
    $scope.notification = "Waiting for the host to start the game!";
    $scope.isGuessTricksDisabled = false;

    $scope.gameOver   = false;
    $scope.winnerName = '';

    $scope.playedCardThisTrick = false;
    $scope.isThrowCardsDisabled = true;

    socket.on('newHandCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('beginNewGame', function(data) {
      $scope.notification = "Game is running!";
    });

    socket.on('cardNotAllowed', function(card) {
      $scope.notification = "Sorry, card is not allowed: " + card.suit + " " + card.value;
      $scope.cards.push(card);
      $scope.playedCardThisTrick = false;
    });

    socket.on('startNewRound', function(round) {
      $scope.currentRound = round;
      $scope.isGuessTricksDisabled = false;
      $scope.notification = "Please guess your number of tricks.";
      $scope.isThrowCardsDisabled = true;
    });

    socket.on('playerHasWonTrick', function(winner) {
      $scope.playedCardThisTrick = false;
    });

    socket.on('playerIsDealer', function() {
      $scope.notification = "Hit \"Start Round\" on the gametable, please. You're the dealer!";
    });

    socket.on('playerBeginTrick', function() {
      $scope.notification = "Your are the first player in this round.";
    });

    socket.on('allTricksGuessed', function() {
      $scope.isThrowCardsDisabled = false;
      $scope.notification = "Game is running!";
    });

    socket.on('gameIsOver', function(winnerName) {
      $scope.notification = "Game is over!";
      $scope.winnerName = winnerName;
      $scope.gameOver = true;
    });



    $scope.throwCard = function(card) {
      if ($scope.playedCardThisTrick === false && $scope.isThrowCardsDisabled === false) {
        // Send card to server
        var data = { gameId : gameData.gameId, card : card };
        socket.emit('playerThrowCard', data);

        // Remove card from array
        for (var indexOfCard = 0; indexOfCard < $scope.cards.length; indexOfCard++) {
            if($scope.cards[indexOfCard].suit === card.suit && $scope.cards[indexOfCard].value === card.value) {
                $scope.cards.splice(indexOfCard, 1);
            }
        }

        $scope.playedCardThisTrick = true;

        return true;
      }
      else {
        // TODO: Notify user that he already played a card
        return false;
      }
    }

    $scope.guessNumberOfTricks = function(number) {
      var data = { gameId : gameData.gameId, guessedTricks : number };
      socket.emit('playerGuessTricks', data);
      $scope.isGuessTricksDisabled = true;
      $scope.notification = "Waiting for others to guess tricks.";
    }

    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

    $scope.range = function(n) {
        return new Array(n);
    };
  });
