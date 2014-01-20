var io;
var gameSocket;

/**
* This function is called by index.js to initialize a new game instance.
*
* @param sio The Socket.IO library
* @param socket The socket object for the connected client.
*/
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('hostRoomFull', hostPrepareGame);
    gameSocket.on('hostNextRound', hostNextRound);

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
    var thisGameId = ( Math.random() * 100 ) | 0;

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
};

/*
* Two players have joined. Alert the host!
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
function hostNextRound(data) {
    
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

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}

/**
* A player has thrown in a new card.
* @param data gameId
*/
function playerThrowCard(data) {

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