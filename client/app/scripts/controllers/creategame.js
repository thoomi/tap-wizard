'use strict';

angular.module('clientApp')
  .controller('CreategameCtrl', function ($scope, $location, socket, hostGameData) {

    $scope.game = {
      wait: 'Waiting for other players to join:',
      play: 'Start',
      players : []
    };

    $scope.isStartDisabled = true;

    // Clear hostGameData
    hostGameData.gameId       = 0;
    hostGameData.currentRound = 1;
    hostGameData.maxRounds    = 20;
    hostGameData.players      = [];

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

      // Enable start button if enough players have joined
      if ($scope.game.players.length >= 3) {
        $scope.isStartDisabled = false;
      }
    });

    socket.on('playerLeftGame', function(id) {
      for (var indexOfPlayer = 0; indexOfPlayer < $scope.game.players.length; indexOfPlayer++) {
        if ($scope.game.players[indexOfPlayer].playerId === id) {
          $scope.game.players.splice(indexOfPlayer, 1);
          hostGameData.players.splice(indexOfPlayer, 1);
        }
      }

      // Disable start button if not enough players have joined
      if ($scope.game.players.length < 3) {
        $scope.isStartDisabled = true;
      }
    });

    socket.on('beginNewGame', function(data) {
      hostGameData.maxRounds = data.maxRounds;

      $location.path('hostgame');
    });


    $scope.prepareGameForPlay = function() {
      $scope.isStartDisabled = true;
      socket.emit('hostPrepareGame', hostGameData.gameId);
    };

    // Let the server know we want to create a new game
    socket.emit('hostCreateNewGame');


    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

    $scope.range = function(n) {
        return new Array(n);
    };
  });
