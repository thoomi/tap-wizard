'use strict';

angular.module('clientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gameData) {
    // $scope.cards = [
    //   { color: 'green', value: 1 },
    //   { color: 'blue', value: 4 },
    //   { color: 'red', value: 9 },
    // ];

    $scope.cards = [];
    $scope.notification = "Waiting for the host to start the game!"

    socket.on('newHandCards', function(data) {
      $scope.cards = data;
    });

    socket.on('beginNewGame', function(data) {
      $scope.notification = "Game is running!";
    });


    $scope.throwCard = function(card) {
      console.log('Throw: ' + card.color + ' ' + card.value);

      var data = { gameId : gameData.gameId, card : card };
      socket.emit('playerThrowCard', data);
    }


    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });
  });
