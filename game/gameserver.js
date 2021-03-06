/* globals GameServer */
var GameTable  = require('./gametable.js').GameTable;
var Host       = require('./host.js').Host;
var Player     = require('./player.js').Player;

var sessionSockets = {};
var sockIo         = {};
var gameTables     = {};



/**
* Module exports
*/
module.exports = GameServer;


/**
* Constructor
*/
function GameServer(sio, io) {
    this.sio = sio;
    sessionSockets = sio;
    sockIo = io;
}

GameServer.prototype.setup = function() {
    var gameServer = this;

    gameServer.sio.on('connection', function (err, socket, session) {

        if (err === null && session !== undefined) {
            console.log('Session: ' + session.id);
            gameServer.initializeListeners(socket);
        }
        else {
            // Send error to client
            socket.emit('error', err);
        }
    });
};


/* *******************************
* *
* HOST FUNCTIONS *
* *
******************************* */

/**
* The 'START GAME' button was clicked and 'hostCreateNewGame' event occurred.
*/
function hostCreateNewGame() {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined) {
            // Create a new host
            var host = new Host(session.id);
            host.setSocket(socket);

            // Create a unique Socket.IO Room / GameId
            // TODO: Develop a proper way to generate a unique gameId
            var newGameId = ( Math.random() * 100 ) | 0;
            //var newGameId = '1';

            // Create a new game table
            gameTables[newGameId] = new GameTable(newGameId, host);

            // Join the specific room for the game
            socket.join(newGameId.toString());

            // Save the gameId also to the session object
            session.gameId = newGameId;
            session.client = 'host';
            session.save();

            // Return the GameId to the browser client
            socket.emit('newGameCreated', { gameId: newGameId });
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}

/*
* Enough players have joined! Start the game.
* @param gameId The game ID / room ID
*/
function hostPrepareGame() {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined && session.gameId !== undefined && session.client === 'host') {

            var gameTable = gameTables[session.gameId];

            if (gameTable !== undefined) {
                var data = { maxRounds : gameTable.getNumberOfRounds(), currentRound : gameTable.getCurrentRound() };
                sockIo.sockets.in(session.gameId).emit('beginNewGame', data);
                gameTable.prepareNewGame();
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}

function hostStartRound() {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined && session.gameId !== undefined && session.client === 'host') {

            var gameTable = gameTables[session.gameId];

            if (gameTable !== undefined) {
                sockIo.sockets.in(session.gameId).emit('startNewRound', gameTable.getCurrentRound());
                gameTable.dealCards();
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}


/* *****************************
* *
* PLAYER FUNCTIONS *
* *
***************************** */

/**
* A player clicked the 'JOIN GAME' button.
* Attempt to connect them to the room that matches
* the gameId entered by the player.
* @param data Contains data entered via player's input - playerName and gameId.
*/
function playerJoinGame(data) {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined) {
            // Look up the room ID in the Socket.IO manager object and the game table in the gameTables object
            var room      = sockIo.sockets.manager.rooms["/" + data.gameId];
            var gameTable = gameTables[data.gameId];
            // If the room and game exists
            if ( room !== undefined && gameTable !== undefined ) {

                // Create a new player
                var player = new Player(session.id, data.playerName);
                player.setSocket(socket);

                // Join the room and the game
                socket.join(data.gameId);
                gameTable.addPlayer(player);

                // Save the gameId and player object to the session
                session.gameId = data.gameId;
                session.client = 'player';
                session.save();

                // Add the session id to the data object
                data.playerId      = session.id;
                data.guessedTricks = 0;
                data.points        = 0;

                // Emit an event notifying the host that a player has joined the game
                gameTable.host.emit('playerJoinedGame', data);

                // Send a confirmation message to the client
                socket.emit('playerJoinSuccess');
            }
            else {
                // Otherwise, send an error message back to the player.
                socket.emit('error', { message: "This room does not exist." });
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}



function playerThrowCard(data) {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined && session.gameId !== undefined && session.client === 'player') {

            var gameTable = gameTables[session.gameId];

            if (gameTable !== undefined) {
                if (gameTable.isCardAllowed(data.card, session.id)) {
                    gameTable.playCard(data.card, session.id);
                }
                else {
                    socket.emit('cardNotAllowed', data.card);
                }
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}


function playerGuessTricks(data) {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined && session.gameId !== undefined && session.client === 'player') {

            var gameTable = gameTables[session.gameId];

            if (gameTable !== undefined) {
                gameTable.playerGuessedTricks(data.guessedTricks, session.id);
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}

/**
* A player or the host disconnected
*/
function disconnect() {
    var socket = this;
    // Get session for the socket
    sessionSockets.getSession(socket, function (err, session) {
        if (err === null && session !== undefined && session.gameId !== undefined) {

            // Get the game the player or host is in
            var gameTable = gameTables[session.gameId];

            if(gameTable !== undefined) {
                if(gameTable.host.getId() === session.id) {
                    sockIo.sockets.in(gameTable.gameId).emit('hostDisconnected');
                    gameTable.gameOver();
                    // Delete game table
                    gameTable = null;
                }
                else {
                    if (gameTable.getState() === 'waiting') {
                        gameTable.removePlayer(session.id);
                        sockIo.sockets.in(gameTable.gameId).emit('playerLeftGame', session.id);
                    }
                    else {
                        // This is a very, very simple solution for the disconnect problem...
                        gameTable.gameOver();
                        gameTable = null;
                    }

                }
            }
        }
        else {
            socket.emit('sessionError', err);
        }
    });
}



/**
* This function is called by app.js to initialize a new game instance.
*/
GameServer.prototype.initializeListeners = function (socket) {
    // Host Events
    socket.on('hostCreateNewGame', hostCreateNewGame);
    socket.on('hostPrepareGame', hostPrepareGame);
    socket.on('hostStartRound', hostStartRound);

    // Player Events
    socket.on('playerJoinGame', playerJoinGame);
    socket.on('playerThrowCard', playerThrowCard);
    socket.on('playerGuessTricks', playerGuessTricks);
    socket.on('disconnect', disconnect);
};
