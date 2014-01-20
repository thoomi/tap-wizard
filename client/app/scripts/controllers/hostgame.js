'use strict';

angular.module('clientApp')
  .controller('HostgameCtrl', function ($scope, socket) {

    $scope.game = {
      wait: 'Waiting for players.',
      play: 'Start',
      players : []
    };

    // Setup event listeners
    socket.on('connected', onConnected);
    socket.on('newGameCreated', onNewGameCreated);
    socket.on('playerJoinedRoom', onPlayerJoinedGame);
    socket.on('playerLeftRoom', onPlayerLeftGame);


    // Let the server know we want to create a new game
    socket.emit('hostCreateNewGame');

    // Listeners
    function onConnected(data) {
      console.log('Websocket connected');
    };

    function onNewGameCreated(data) {
      $scope.game.id = data.gameId;
    }

    function onPlayerJoinedGame(data) {
      $scope.game.players.push(data);
      console.log(data);
    }

    function onPlayerLeftGame(data) {
      for (var indexOfPlayer = 0; indexOfPlayer < $scope.game.players.length; indexOfPlayer++) {
        if ($scope.game.players[indexOfPlayer].mySocketId === data) {
          $scope.game.players.splice(indexOfPlayer, 1);
        };
      };
    }

    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });
  });
