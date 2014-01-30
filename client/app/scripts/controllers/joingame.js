'use strict';

angular.module('clientApp')
  .controller('JoingameCtrl', function ($scope, $location, socket, gameData) {
    $scope.joinGameText = 'Join';

    $scope.connectToGame = function() {
      gameData.playerName = $scope.playerName;
      gameData.gameId = $scope.gameId;

      // Test values
      //gameData.playerName = 'Heinz';
      gameData.gameId     = 1;


      // Send the connect to game message
      socket.emit('playerJoinGame', gameData);
    }

    socket.on('playerJoinSuccess', function(data) {
      // Switch to the game controller and view
      $location.path('playergame');
    });

    socket.on('error', function(data) {
      console.log('Error: ' + data);
    });

    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

  });
