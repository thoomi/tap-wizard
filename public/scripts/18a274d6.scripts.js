"use strict";angular.module("clientApp",["hmTouchEvents"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/joingame",{templateUrl:"views/joingame.html",controller:"JoingameCtrl"}).when("/creategame",{templateUrl:"views/creategame.html",controller:"CreategameCtrl"}).when("/playergame",{templateUrl:"views/playergame.html",controller:"PlayergameCtrl"}).when("/hostgame",{templateUrl:"views/hostgame.html",controller:"HostgameCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",["$scope",function(a){a.game={start:"new game",join:"join game"}}]),angular.module("clientApp").factory("socket",["$rootScope",function(a){var b=io.connect("http://wiz.herokuapp.com");return{on:function(c,d){b.on(c,function(){var c=arguments;a.$apply(function(){d.apply(b,c)})})},emit:function(c,d,e){b.emit(c,d,function(){var c=arguments;a.$apply(function(){e&&e.apply(b,c)})})},removeAllListeners:function(){b.removeAllListeners()}}}]),angular.module("clientApp").controller("JoingameCtrl",["$scope","$location","socket","gameData",function(a,b,c,d){a.joinGameText="Join",a.isConnectDisabled=!1,a.connectToGame=function(){a.isConnectDisabled=!0,a.joinGameText="Joining..",d.playerName=a.playerName,d.gameId=a.gameId,c.emit("playerJoinGame",d)},c.on("playerJoinSuccess",function(){b.path("playergame")}),c.on("error",function(b){console.log("Error: "+b),a.isConnectDisabled=!1,a.joinGameText="Join"}),a.$on("$destroy",function(){c.removeAllListeners()})}]),angular.module("clientApp").controller("CreategameCtrl",["$scope","$location","socket","hostGameData",function(a,b,c,d){a.game={wait:"Waiting for other players to join:",play:"Start",players:[]},a.isStartDisabled=!0,c.on("connected",function(){console.log("Websocket connected")}),c.on("newGameCreated",function(b){a.game.id=b.gameId,d.gameId=b.gameId}),c.on("playerJoinedGame",function(b){a.game.players.push(b),d.players.push(b),a.game.players.length>=3&&(a.isStartDisabled=!1)}),c.on("playerLeftGame",function(b){for(var c=0;c<a.game.players.length;c++)a.game.players[c].playerId===b&&a.game.players.splice(c,1)}),c.on("beginNewGame",function(a){d.maxRounds=a.maxRounds,b.path("hostgame")}),a.prepareGameForPlay=function(){a.isStartDisabled=!0,c.emit("hostPrepareGame",d.gameId)},c.emit("hostCreateNewGame"),a.$on("$destroy",function(){c.removeAllListeners()}),a.range=function(a){return new Array(a)}}]),angular.module("clientApp").controller("PlayergameCtrl",["$scope","socket","gameData",function(a,b,c){a.cards=[],a.currentRound=0,a.notification="Waiting for the host to start the game!";var d=!1;a.isGuessTricksDisabled=!0,b.on("newHandCard",function(b){a.cards.push(b)}),b.on("beginNewGame",function(){a.notification="Game is running!"}),b.on("cardNotAllowed",function(b){a.cards.push(b)}),b.on("startNewRound",function(b){a.currentRound=b,a.isGuessTricksDisabled=!1}),b.on("playerHasWonTrick",function(){a.playedCardThisTrick=!1}),a.throwCard=function(e){if(d===!1&&a.isGuessTricksDisabled===!0){var f={gameId:c.gameId,card:e};b.emit("playerThrowCard",f);for(var g=0;g<a.cards.length;g++)a.cards[g].color===e.color&&a.cards[g].value===e.value&&a.cards.splice(g,1);a.playedCardThisTrick=!0}},a.guessNumberOfTricks=function(d){var e={gameId:c.gameId,guessedTricks:d};b.emit("playerGuessTricks",e),a.isGuessTricksDisabled=!0},a.$on("$destroy",function(){b.removeAllListeners()}),a.range=function(a){return new Array(a)}}]),angular.module("clientApp").factory("gameData",function(){var a="Player",b=0;return{playerName:a,gameId:b}}),angular.module("clientApp").controller("HostgameCtrl",["$scope","socket","hostGameData","$timeout",function(a,b,c,d){a.gameId=c.gameId,a.players=c.players,a.cards=[],a.round={current:c.currentRound,max:c.maxRounds},a.trickwinner="",a.trumpCard={},a.scores=[],a.isStartRoundDisabled=!1,b.on("playerHasThrownCard",function(b){a.cards.push(b)}),b.on("newTrumpCard",function(b){a.trumpCard=b}),b.on("playerGuessedTricks",function(b){a.scores[a.round.current][b.playerId]={},a.scores[a.round.current][b.playerId].guessedTricks=b.guessedTricks}),b.on("playerHasWonTrick",function(b){a.trickwinner=b,d(function(){a.cards=[],console.log("executed")},5e3)}),b.on("roundIsOver",function(b){a.trumpCard={};for(var c=0;c<a.players.length;c++){var d=a.players[c].playerId,e=a.players[c].points,f=b[d];a.scores[a.round.current][d].score=e+f,a.players[c].points=e+f}a.round.current++,a.isStartRoundDisabled=!1}),a.startRound=function(){a.isStartRoundDisabled=!0,a.scores[a.round.current]={},a.trickwinner="",b.emit("hostStartRound",c.gameId)},a.range=function(a){return new Array(a)}}]),angular.module("clientApp").factory("hostGameData",function(){function a(a){for(var b=0;b<c.length;b++)if(c[b].playerId===a)return c[b]}var b=0,c=[],d=1,e=20;return{gameId:b,players:c,currentRound:d,maxRounds:e,numberOfPlayers:c.length,findPlayerById:a}}),angular.module("clientApp").directive("tbPlayingCard",function(){return{templateUrl:"../../views/tb-playingcard.html",restrict:"E",scope:{card:"=info"}}});