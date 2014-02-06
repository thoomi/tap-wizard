"use strict";angular.module("clientApp",["hmTouchEvents"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/joingame",{templateUrl:"views/joingame.html",controller:"JoingameCtrl"}).when("/creategame",{templateUrl:"views/creategame.html",controller:"CreategameCtrl"}).when("/playergame",{templateUrl:"views/playergame.html",controller:"PlayergameCtrl"}).when("/hostgame",{templateUrl:"views/hostgame.html",controller:"HostgameCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",["$scope",function(a){a.game={start:"new game",join:"join game"}}]),angular.module("clientApp").factory("socket",["$rootScope",function(a){var b=io.connect("http://afternoon-lowlands-7192.herokuapp.com");return{on:function(c,d){b.on(c,function(){var c=arguments;a.$apply(function(){d.apply(b,c)})})},emit:function(c,d,e){b.emit(c,d,function(){var c=arguments;a.$apply(function(){e&&e.apply(b,c)})})},removeAllListeners:function(){b.removeAllListeners()}}}]),angular.module("clientApp").controller("JoingameCtrl",["$scope","$location","socket","gameData",function(a,b,c,d){a.joinGameText="Join",a.connectToGame=function(){d.playerName=a.playerName,d.gameId=a.gameId,c.emit("playerJoinGame",d)},c.on("playerJoinSuccess",function(){b.path("playergame")}),c.on("error",function(a){console.log("Error: "+a)}),a.$on("$destroy",function(){c.removeAllListeners()})}]),angular.module("clientApp").controller("CreategameCtrl",["$scope","$location","socket","hostGameData",function(a,b,c,d){a.game={wait:"Waiting for other players to join:",play:"Start",players:[]},c.on("connected",function(){console.log("Websocket connected")}),c.on("newGameCreated",function(b){a.game.id=b.gameId,d.gameId=b.gameId}),c.on("playerJoinedGame",function(b){a.game.players.push(b),d.players.push(b)}),c.on("playerLeftGame",function(b){for(var c=0;c<a.game.players.length;c++)a.game.players[c].mySocketId===b&&a.game.players.splice(c,1)}),c.on("beginNewGame",function(a){d.maxRounds=a.maxRounds,b.path("hostgame")}),a.prepareGameForPlay=function(){c.emit("hostPrepareGame",d.gameId)},c.emit("hostCreateNewGame"),a.$on("$destroy",function(){c.removeAllListeners()}),a.range=function(a){return new Array(a)}}]),angular.module("clientApp").controller("PlayergameCtrl",["$scope","socket","gameData",function(a,b,c){a.cards=[],a.currentRound=0,a.notification="Waiting for the host to start the game!",a.isGuessTricksDisabled=!0,b.on("newHandCard",function(b){a.cards.push(b)}),b.on("beginNewGame",function(){a.notification="Game is running!"}),b.on("cardNotAllowed",function(b){a.cards.push(b)}),b.on("startNewRound",function(b){a.currentRound=b,a.isGuessTricksDisabled=!1}),a.throwCard=function(d){var e={gameId:c.gameId,card:d};b.emit("playerThrowCard",e);for(var f=0;f<a.cards.length;f++)a.cards[f].color===d.color&&a.cards[f].value===d.value&&a.cards.splice(f,1)},a.guessNumberOfTricks=function(d){var e={gameId:c.gameId,guessedTricks:d};b.emit("playerGuessTricks",e),a.isGuessTricksDisabled=!0},a.$on("$destroy",function(){b.removeAllListeners()}),a.range=function(a){return new Array(a)}}]),angular.module("clientApp").factory("gameData",function(){var a="Player",b=0;return{playerName:a,gameId:b}}),angular.module("clientApp").controller("HostgameCtrl",["$scope","socket","hostGameData",function(a,b,c){a.gameId=c.gameId,a.players=c.players,a.cards=[],a.round={current:c.currentRound,max:c.maxRounds},a.trickwinner="",a.trumpCard={},a.scores=[],a.isStartRoundDisabled=!1,b.on("playerHasThrownCard",function(b){a.cards.push(b)}),b.on("newTrumpCard",function(b){a.trumpCard=b}),b.on("playerGuessedTricks",function(b){a.scores[a.round.current][b.socketId]={},a.scores[a.round.current][b.socketId].guessedTricks=b.guessedTricks}),b.on("playerHasWonTrick",function(b){a.trickwinner=b,a.cards=[]}),b.on("roundIsOver",function(b){a.trickwinner="",a.trumpCard={};for(var c=0;c<a.players.length;c++){var d=a.players[c].socketId,e=a.players[c].points,f=b[d];a.scores[a.round.current][d].score=e+f,a.players[c].points=e+f}a.round.current++,a.isStartRoundDisabled=!1}),a.startRound=function(){a.isStartRoundDisabled=!0,a.scores[a.round.current]={},b.emit("hostStartRound",c.gameId)},a.range=function(a){return new Array(a)}}]),angular.module("clientApp").factory("hostGameData",function(){function a(a){for(var b=0;b<c.length;b++)if(c[b].socketId===a)return c[b]}var b=0,c=[],d=1,e=20;return{gameId:b,players:c,currentRound:d,maxRounds:e,numberOfPlayers:c.length,findPlayerBySocketId:a}}),angular.module("clientApp").directive("tbPlayingCard",function(){return{templateUrl:"../../views/tb-playingcard.html",restrict:"E",scope:{card:"=info"}}});