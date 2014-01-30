'use strict';

angular.module('clientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gameData) {

    $scope.cards = [];
    $scope.notification = "Waiting for the host to start the game!"

    socket.on('newHandCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('beginNewGame', function(data) {
      $scope.notification = "Game is running!";
    });

    socket.on('cardNotAllowed', function(card) {
      $scope.cards.push(card);
    });


    $scope.throwCard = function(card) {
      console.log('Throw: ' + card.color + ' ' + card.value);

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


    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });
  });
