var Player = require('./player.js').Player;
var Deck   = require('./deck.js').Deck;

exports.GameTable = function(gameId) {
    'use strict';

    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }

    var m_gameId          = gameId;
    var m_deck            = new Deck();
    var m_cardsOnTable    = [];
    var m_hostSocket      = null;
    var m_players         = [];
    var m_numberOfPlayers = 0;
    var m_maxRounds       = 0;
    var m_currentRound    = 1;


    function addPlayer(socket, name) {
        // Create a new player
        var player = new Player(socket, m_gameId, name);
        // Save the player
        m_players.push(player);

        m_numberOfPlayers++;
    }
    function removePlayer(socket) {

        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if(m_players[indexOfPlayer].socket.id === socket.id) {
                m_players.splice(indexOfPlayer, 1);
            }
        }

        m_numberOfPlayers--;
    }


    function dealCards() {
        // Shuffle card deck
        m_deck.shuffle();

        for (var indexOfTurn = 0; indexOfTurn < m_currentRound; indexOfTurn++) {
            for (var indexOfPlayer = 0; indexOfPlayer < m_numberOfPlayers; indexOfPlayer++) {
                m_players[indexOfPlayer].addCard(m_deck.cards[indexOfTurn * m_numberOfPlayers + indexOfPlayer]);
            }
        }
    }

    function getNumberOfRounds() {
        // Calculate the number of rounds to play
        m_maxRounds = m_deck.numberOfCards / m_numberOfPlayers;

        return m_maxRounds;
    }

    return {
        gameId            : m_gameId,
        hostSocket        : m_hostSocket,
        addPlayer         : addPlayer,
        removePlayer      : removePlayer,
        currentRound      : m_currentRound,
        getNumberOfRounds : getNumberOfRounds,
        dealCards         : dealCards
    }
};
