'use strict';

angular.module('clientApp')
  .controller('HostgameCtrl', function ($scope, socket, hostGameData) {
    $scope.gameId       = hostGameData.gameId;
    $scope.players      = hostGameData.players;
    $scope.cards        = [];
    var numberOfPlayers = hostGameData.players.length;
    $scope.round        = { current: 1, max: hostGameData.maxNumberOfCards / numberOfPlayers };

    socket.on('playerHasThrownCard', function(card) {
      $scope.cards.push(card);
    });


    function startRound(numberOfRound) {
      socket.emit('hostDistributeCards', { round : numberOfRound, numberOfPlayers : numberOfPlayers, gameId : hostGameData.gameId });
    }

    startRound(5);

  });
