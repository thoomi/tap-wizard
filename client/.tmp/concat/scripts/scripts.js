'use strict';

angular.module('clientApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/joingame', {
        templateUrl: 'views/joingame.html',
        controller: 'JoingameCtrl'
      })
      .when('/creategame', {
        templateUrl: 'views/creategame.html',
        controller: 'CreategameCtrl'
      })
      .when('/playergame', {
        templateUrl: 'views/playergame.html',
        controller: 'PlayergameCtrl'
      })
      .when('/hostgame', {
        templateUrl: 'views/hostgame.html',
        controller: 'HostgameCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



'use strict';

angular.module('clientApp')
    .controller('MainCtrl', function ($scope) {
        $scope.game = {
          start: 'new game',
          join: 'join game'
        };
    });

'use strict';

angular.module('clientApp')
 .factory('socket', function ($rootScope) {
        var socket = io.connect('http://wiz.herokuapp.com');
        //var socket = io.connect('http://192.168.0.111:3000');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            removeAllListeners: function() {
              socket.removeAllListeners();
            }
        };
  });

'use strict';

angular.module('clientApp')
  .controller('JoingameCtrl', function ($scope, $location, socket, gameData) {

    $scope.joinGameText = 'Join';
    $scope.isConnectDisabled = false;

    // Clear gameData
    gameData.playerName = 'Player';
    gameData.gameId     = 0;


    $scope.connectToGame = function() {
      $scope.isConnectDisabled = true;
      $scope.joinGameText = 'Joining..';

      gameData.playerName = $scope.playerName;
      gameData.gameId = $scope.gameId;

      // Test values
      //gameData.playerName = 'Heinz';
      //gameData.gameId     = 1;


      // Send the connect to game message
      socket.emit('playerJoinGame', gameData);
    }

    socket.on('playerJoinSuccess', function(data) {
      // Switch to the game controller and view
      $location.path('playergame');
    });

    socket.on('error', function(data) {
      console.log('Error: ' + data);
      $scope.isConnectDisabled = false;
      $scope.joinGameText = 'Join';
    });

    // Remove all socket listeners when the controller is destroyed
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

  });

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

'use strict';

angular.module('clientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gameData) {

    $scope.cards = [];

    $scope.currentRound = 0;
    $scope.notification = "Waiting for the host to start the game!";
    $scope.isGuessTricksDisabled = true;

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

'use strict';

angular.module('clientApp')
  .factory('gameData', function () {
    var playerName = 'Player';
    var gameId = 0;

    // Public API here
    return {
        playerName : playerName,
        gameId     : gameId
      };
  });

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
    $scope.gameOver     = false;
    $scope.winnerName   = '';


    $scope.isStartRoundDisabled = false;

    socket.on('playerHasThrownCard', function(card) {
      $scope.cards.push(card);
    });

    socket.on('newTrumpCard', function(card) {
      $scope.trumpCard = card;
    });

    socket.on('playerGuessedTricks', function(data) {
      $scope.scores[$scope.round.current][data.playerId] = {};
      $scope.scores[$scope.round.current][data.playerId].guessedTricks = data.guessedTricks;
    });

    socket.on('playerHasWonTrick', function(name) {
      $scope.trickwinner = name;
      $timeout(function() {
        $scope.cards = [];
        console.log('executed');
      },5000);
    });

    socket.on('roundIsOver', function(points) {
      $scope.trumpCard = {};

      for (var indexOfPlayer = 0; indexOfPlayer < $scope.players.length; indexOfPlayer++) {
        var playerId     = $scope.players[indexOfPlayer].playerId
        var currentScore = $scope.players[indexOfPlayer].points;
        var scoreToAdd   = points[playerId];

        $scope.scores[$scope.round.current][playerId].score = currentScore + scoreToAdd;
        $scope.players[indexOfPlayer].points = currentScore + scoreToAdd;
      }

      $scope.round.current++;
      $scope.isStartRoundDisabled = false;
    });

    socket.on('gameIsOver', function(winnerName) {
      $scope.winnerName = winnerName;
      $scope.gameOver = true;
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

'use strict';

angular.module('clientApp')
  .factory('hostGameData', function () {
    var gameId       = 0;
    var players      = [];
    var currentRound = 1;
    var maxRounds    = 20;

    function findPlayerById(playerId) {
      for (var indexOfPlayer = 0; indexOfPlayer < players.length; indexOfPlayer++) {
            if(players[indexOfPlayer].playerId === playerId) {
                return players[indexOfPlayer];
            }
        }
    }

    // Public API here
    return {
      gameId          : gameId,
      players         : players,
      currentRound    : currentRound,
      maxRounds       : maxRounds,
      numberOfPlayers : players.length,
      findPlayerById  : findPlayerById
    };
  });

'use strict';

angular.module('clientApp')
  .directive('tbPlayingCard', function ($document) {

    // function touchHandler(event) {
    //   var touch = event.changedTouches[0];

    //   var simulatedEvent = document.createEvent("MouseEvent");
    //       simulatedEvent.initMouseEvent({
    //       touchstart: "mousedown",
    //       touchmove: "mousemove",
    //       touchend: "mouseup"
    //   }[event.type], true, true, window, 1,
    //       touch.screenX, touch.screenY,
    //       touch.clientX, touch.clientY, false,
    //       false, false, false, 0, null);

    //   touch.target.dispatchEvent(simulatedEvent);
    //   event.preventDefault();
    // }

    // function init() {
    //     document.addEventListener("touchstart", touchHandler, true);
    //     document.addEventListener("touchmove", touchHandler, true);
    //     document.addEventListener("touchend", touchHandler, true);
    //     document.addEventListener("touchcancel", touchHandler, true);
    // }

    return {
      templateUrl: '../../views/tb-playingcard.html',
      restrict: 'E',
      scope: {
        card: '=info',
        throwCard: '&callbackFn'
      }
      // link: function(scope, element, attr) {
      //   var startX = 0, startY = 0, x = 0, y = 0;
      //   var scrollXStart = 0;
      //   var parent = element.parent().parent();

      //   // Init touch event to mouse event matcher
      //   //init();

      //   element.css({
      //     position: 'relative'
      //   });

      //   element.on('mousedown', function(event) {
      //     // Prevent default dragging of selected content
      //     event.preventDefault();

      //     element.removeClass('playing-card-animation');

      //     startY = event.pageY - y;
      //     scrollXStart = event.pageX;
      //     $document.on('mousemove', mousemove);
      //     $document.on('mouseup', mouseup);
      //   });

      //   function mousemove(event) {
      //     var delta = (event.pageX - scrollXStart) * 0.1;
      //     var scrollOld = parent.prop('scrollLeft');
      //     parent.prop('scrollLeft', scrollOld - delta);


      //     y = event.pageY - startY;
      //     if (y > 0) {
      //       y = 0;
      //     }

      //     element.css({
      //       top: y + 'px'
      //     });
      //   }

      //   function mouseup() {
      //     var halfHeight = element.children()[0].offsetHeight / 2
      //     var dragValue  = Math.abs(parseInt(element.css('top')));

      //     element.addClass('playing-card-animation');

      //     // Check if the user dragged the element more than 50%
      //     if (dragValue > halfHeight) {

      //       if(scope.throwCard(scope.card) === false) {
      //         element.css({
      //           top: 0
      //         });
      //       }
      //       else {
      //         element.css({
      //           top: -(halfHeight * 2 + 50) + 'px'
      //         });
      //       }
      //     }
      //     else {
      //       element.css({
      //         top: 0,
      //       });
      //     }

      //     // Reset values
      //     startX = 0, startY = 0, x = 0, y = 0;
      //     $document.unbind('mousemove', mousemove);
      //     $document.unbind('mouseup', mouseup);
      //   }
      // }
    };
  });

'use strict';

angular.module('clientApp')
  .directive('modalDialog', function() {

    return {
      templateUrl: '../../views/modaldialog.html',
      restrict: 'E',
      scope: {
        winnerName: '=info'
      }
    };
});
