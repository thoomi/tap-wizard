var Table  = require('./gametable.js');


var io;
var gameSocket;

var gameTables  = {};

/**
* This function is called by index.js to initialize a new game instance.
*
* @param sio The Socket.IO library
* @param socket The socket object for the connected client.
*/
exports.initGameServer = function(sio, socket) {
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('hostIsReady', hostPrepareGame);
    gameSocket.on('hostDistributeCards', hostDistributeCards);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerThrowCard', playerThrowCard);
    gameSocket.on('disconnect', playerDisconnect);
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
    // Create a unique Socket.IO Room
    //var thisGameId = ( Math.random() * 100 ) | 0;
    var thisGameId = 1;

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
};

/*
* Enough players have joined! Start the game.
* @param gameId The game ID / room ID
*/
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };
    //console.log("All Players Present. Preparing game...");
    io.sockets.in(data.gameId).emit('beginNewGame', data);
}

/**
* All cards for a round are played and the host attempts to start the next round
* @param data Sent from the client. Contains the current round and gameId (room)
*/
function hostDistributeCards(data) {
    var sock = this;
    var clients   = io.sockets.clients(data.gameId);

    var cardStack = fullCardStack.slice();

    shuffleArray(cardStack);

    var counter    = 0;
    var nextPlayer = true;
    for(var indexOfClient = 0; indexOfClient < clients.length; indexOfClient++) {
        // If the client is not the host send him cards
        if (clients[indexOfClient].id !== sock.id) {
            var cards = [];

            // Send as many cards as for the current round needed
            for (var indexOfCard = 0; indexOfCard < data.round; indexOfCard++) {
                cards.push(cardStack[counter * data.round + indexOfCard]);
            }

            clients[indexOfClient].emit('newHandCards', cards);

            counter++;
        }
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
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.manager.rooms["/" + data.gameId];

    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

        sock.emit('playerJoinSuccess', sock.id);

    } else {
        // Otherwise, send an error message back to the player.
        sock.emit('error',{message: "This room does not exist."} );
    }
}

/**
* A player has thrown in a new card.
* @param data gameId
*/
function playerThrowCard(data) {
    // Push thrown card to host
    io.sockets.in(data.gameId).emit('playerHasThrownCard', data.card);
}

function playerDisconnect() {
	// A reference to the player's Socket.IO socket object
    var sock = this;

     // this returns a list of all rooms this user is in
   var rooms = io.sockets.manager.roomClients[sock.id];
   for(var room in rooms) {
       io.sockets.in(room).emit('playerLeftRoom', sock.id);
   }
}
