'use strict';

angular.module('clientApp')
  .controller('CreategameCtrl', function ($scope, $location, socket, hostGameData) {

    $scope.game = {
      wait: 'Waiting for players.',
      play: 'Start',
      players : []
    };

    // Setup event listeners
    socket.on('connected', function(data) {
      console.log('Websocket connected');
    });

    socket.on('newGameCreated', function(data) {
      $scope.game.id = data.gameId;
      hostGameData.gameId = data.gameId;
    });

    socket.on('playerJoinedGame', function(data) {
      $scope.game.players.push(data);
      hostGameData.players.push(data);
    });

    socket.on('playerLeftGame', function(data) {
      for (var indexOfPlayer = 0; indexOfPlayer < $scope.game.players.length; indexOfPlayer++) {
        if ($scope.game.players[indexOfPlayer].mySocketId === data) {
          $scope.game.players.splice(indexOfPlayer, 1);
        };
      };
    });

    socket.on('beginNewGame', function(data) {
      hostGameData.maxRounds = data.maxRounds;

      $location.path('hostgame');
    });


    $scope.prepareGameForPlay = function() {
      socket.emit('hostPrepareGame', hostGameData.gameId);
    };

    // Let the server know we want to create a new game
    socket.emit('hostCreateNewGame');


    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });
  });
