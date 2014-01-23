var Player = require('./player.js').Player;
var Deck   = require('./deck.js').Deck;

exports.GameTable = function(gameId) {
    'use strict';

    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }

    var m_gameId          = gameId;
    var m_deck            = Deck();
    var m_hostSocket      = null;
    var m_players         = {};
    var m_numberOfPlayers = 0;
    var m_maxRounds       = 0;
    var m_currentRound    = 1;


    function addPlayer(socket, name) {
        // Create a new player
        var player = new Player(socket, m_gameId, name);
        // Save the player by its socketId
        m_players[player.socket.id] = player;

        m_numberOfPlayers++;
    }
    function removePlayer(socket) {
        delete m_players[socket.id];
        m_numberOfPlayers--;
    }


    function getNumberOfRounds() {
        // Calculate the number of rounds to play
        m_maxRounds = m_deck.numberOfCards / m_numberOfPlayers;

        return m_maxRounds;
    }

    return {
        gameId       : m_gameId,
        hostSocket   : m_hostSocket,
        addPlayer    : addPlayer,
        removePlayer : removePlayer,
        currentRound : m_currentRound,
        getNumberOfRounds  : getNumberOfRounds
    }
};
