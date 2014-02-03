var GameTable  = require('./gametable.js').GameTable;

var io;

var gameTables  = {};

/**
* This function is called by index.js to initialize a new game instance.
*
* @param sio The Socket.IO library
* @param socket The socket object for the connected client.
*/
exports.initGameServer = function(sio, socket) {
    io = sio;

    socket.emit('connected', { message: "You are connected!" });

    // Host Events
    socket.on('hostCreateNewGame', hostCreateNewGame);
    socket.on('hostPrepareGame', hostPrepareGame);
    socket.on('hostStartRound', hostStartRound);

    // Player Events
    socket.on('playerJoinGame', playerJoinGame);
    socket.on('playerThrowCard', playerThrowCard);
    socket.on('playerGuessTricks', playerGuessTricks);
    socket.on('disconnect', playerDisconnect);
}

/* *******************************
* *
* HOST FUNCTIONS *
* *
******************************* */

/**
* The 'START GAME' button was clicked and 'hostCreateNewGame' event occurred.
*/
function hostCreateNewGame() {
    // A reference to the host's Socket.IO socket object
    var hostSocket = this;

    // Create a unique Socket.IO Room / GameId
    // TODO: Develop a proper way to generate a unique gameId
    //var newGameId = ( Math.random() * 100 ) | 0;
    var newGameId = '1';

    // Create a new game table
    gameTables[newGameId] = new GameTable(newGameId, hostSocket);

    // Join the specific room for the game
    hostSocket.join(newGameId.toString());

    // Save the gameId also to the socket object
    hostSocket.gameId = newGameId;

    // Return the GameId to the browser client
    hostSocket.emit('newGameCreated', { gameId: newGameId });
};

/*
* Enough players have joined! Start the game.
* @param gameId The game ID / room ID
*/
function hostPrepareGame(gameId) {
    var gameTable = gameTables[gameId];

    if (gameTable != undefined) {
        var data = { maxRounds : gameTable.getNumberOfRounds(), currentRound : gameTable.getCurrentRound() };
        io.sockets.in(gameId).emit('beginNewGame', data);
    }
}

function hostStartRound(gameId) {
    var gameTable = gameTables[gameId];

    if (gameTable != undefined) {
        io.sockets.in(gameId).emit('startNewRound', gameTable.getCurrentRound() );
        gameTable.dealCards();
    }
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
    // A reference to the player's Socket.IO socket object
    var playerSocket = this;

    // Look up the room ID in the Socket.IO manager object and the game table in the gameTables object
    var room      = io.sockets.manager.rooms["/" + data.gameId];
    var gameTable = gameTables[data.gameId];

    // If the room and game exists
    if( room != undefined && gameTable != undefined ){

        // Join the room and the game
        playerSocket.join(data.gameId);
        gameTable.addPlayer(playerSocket, data.playerName);

        // Save the gameId to the player's socket object
        playerSocket.gameId = data.gameId;

        // Add the socket Id to the data object
        data.socketId = playerSocket.id;
        data.points   = 0;
        data.guessedTricks = 0;

        // Emit an event notifying the host that a player has joined the game
        gameTable.hostSocket.emit('playerJoinedGame', data);

        // Send a confirmation message to the client
        playerSocket.emit('playerJoinSuccess');
    }
    else {
        // Otherwise, send an error message back to the player.
        playerSocket.emit('error', { message: "This room does not exist." });
    }
}



function playerThrowCard(data) {
    // A reference to the player's Socket.IO socket object
    var playerSocket = this;

    var gameTable = gameTables[data.gameId];

    if (gameTable != undefined) {
        if (gameTable.isCardAllowed(data.card, playerSocket.id)) {
            gameTable.playCard(data.card, playerSocket.id);
        }
        else {
            playerSocket.emit('cardNotAllowed', data.card);
        }
    }
}


function playerGuessTricks(data) {
    // A reference to the player's Socket.IO socket object
    var playerSocket = this;

    var gameTable = gameTables[data.gameId];

    if (gameTable != undefined) {
        gameTable.playerGuessedTricks(data.guessedTricks, playerSocket.id);
    }
}

/**
* A player or the host disconnected
* @param data gameId
*/
function playerDisconnect() {
	// A reference to the player's or hosts Socket.IO socket object
    var socket = this;

    // Get the game the player or host is in
    var gameTable = gameTables[socket.gameId];

    if(gameTable != undefined) {
        if(gameTable.hostSocket.id === socket.id) {
            io.sockets.in(gameTable.gameId).emit('hostDisconnected');
            // Delete game table
            delete gameTable;
        }
        else {
            gameTable.removePlayer(socket);
            io.sockets.in(gameTable.gameId).emit('playerLeftGame', socket.id);
        }
    }
}
