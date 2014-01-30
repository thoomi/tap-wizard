var Player = require('./player.js').Player;
var Deck   = require('./deck.js').Deck;

exports.GameTable = function(gameId, hostSocket) {
    'use strict';

    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }

    var m_gameId          = gameId;
    var m_deck            = new Deck();
    var m_cardsOnTable    = [];
    var m_hostSocket      = hostSocket;
    var m_players         = [];
    var m_numberOfPlayers = 0;
    var m_maxRounds       = 0;
    var m_currentRound    = 1;
    var m_playedTricks    = 0;
    var m_trumpColor      = '';


    function addPlayer(socket, name) {
        // Create a new player
        var player = new Player(socket, this, name);
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

    function findPlayerBySocketId(socketId) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if(m_players[indexOfPlayer].socket.id === socketId) {
                return m_players[indexOfPlayer];
            }
        }
    }


    function dealCards() {
        var dealedCards = 0;
        // Shuffle card deck
        m_deck.shuffle();

        for (var indexOfTurn = 0; indexOfTurn < m_currentRound; indexOfTurn++) {
            for (var indexOfPlayer = 0; indexOfPlayer < m_numberOfPlayers; indexOfPlayer++) {
                m_players[indexOfPlayer].addCard(m_deck.cards[indexOfTurn * m_numberOfPlayers + indexOfPlayer]);
                // Also update the players browser
                m_players[indexOfPlayer].socket.emit('newHandCard', m_deck.cards[indexOfTurn * m_numberOfPlayers + indexOfPlayer]);
                // Count dealedCards
                dealedCards++;
            }
        }

        // Choose trump card
        var trumpCard = m_deck.cards[dealedCards];
        if (trumpCard != undefined) {
            m_trumpColor = trumpCard.color;
            m_hostSocket.emit('newTrumpCard', trumpCard);
        }
    }

    function getNumberOfRounds() {
        // Calculate the number of rounds to play
        m_maxRounds = m_deck.numberOfCards / m_numberOfPlayers;

        return m_maxRounds;
    }

    function isCardAllowed(card, socketId) {
        // Check if card is wizard or fool
        if (card.color == 'wizard' || card.color == 'fool' ) {
            return true;
        }

        // Check if card color matches the color of the first normal card
        for (var indexOfCard = 0; indexOfCard < m_cardsOnTable.length; indexOfCard++) {
            if (m_cardsOnTable[indexOfCard].color != 'wizard' || m_cardsOnTable[indexOfCard].color != 'fool') {
                if (m_cardsOnTable[indexOfCard].color == card.color) {
                    return true;
                }
                else {
                    // Get the players current cards
                    var player        = findPlayerBySocketId(socketId);
                    var playerCards   = player.getCards();
                    var searchedColor = m_cardsOnTable[indexOfCard].color;

                    // Check if player has a matching color
                    for (var indexOfPlayerCards = 0; indexOfPlayerCards < playerCards.length; indexOfPlayerCards++) {
                        if (playerCards[indexOfPlayerCards].color == m_cardsOnTable[indexOfCard].color) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    function playCard(card, socketId) {
        // Add player to card
        card.playerSocketId = socketId;

        // Add card to table and notify host
        m_cardsOnTable.push(card);
        m_hostSocket.emit('playerHasThrownCard', card);

        // Check if all cards for this round are played
        if (m_cardsOnTable.length === m_numberOfPlayers) {
            calculateTrickWinner();
            m_playedTricks++;

            // Check if the round is over
            if (m_playedTricks === m_currentRound) {
                // TODO: Calculate points and start next round
            }
        }
    }
    function setTrickWinner(socketId) {
        // Get player
        var winner = findPlayerBySocketId(socketId);
        winner.addTrick();

        // Notify host about the winner
        m_hostSocket.emit('playerHasWonTrick', winner.name);

        // Empty array
        m_cardsOnTable = [];
    }

    function calculateTrickWinner() {
        var foolCount  = 0;
        var comparableCards = [];
        var winnerCard = null;

        for (var indexOfCard = 0; indexOfCard < m_cardsOnTable.length; indexOfCard++) {
            if (m_cardsOnTable[indexOfCard].color == 'wizard') {
                // Wizard detected
                setTrickWinner(m_cardsOnTable[indexOfCard].playerSocketId);
                return;
            }
            else if (m_cardsOnTable[indexOfCard].color == 'fool') {
                // Do nothing and check the next card
                foolCount++;
                if (m_cardsOnTable.length === foolCount) {
                    // Only fools detected
                    setTrickWinner(m_cardsOnTable[0].playerSocketId);
                    return;
                }
            }
            else {
                // Card is not a wizard and not a fool
                comparableCards.push(m_cardsOnTable[indexOfCard]);
            }
        }

        // Set the winner card
        winnerCard = comparableCards[0];

        for (var i = 1; i < comparableCards.length; i++) {
            // Check if color is the same
            if(comparableCards[i].color === winnerCard.color) {
                // Check if value is higher
                if(comparableCards[i].value > winnerCard.value) {
                    winnerCard = comparableCards[i];
                }
            }
        }

        // Set winner
        setTrickWinner(winnerCard.playerSocketId);
    }


    return {
        gameId            : m_gameId,
        hostSocket        : m_hostSocket,
        addPlayer         : addPlayer,
        removePlayer      : removePlayer,
        currentRound      : m_currentRound,
        getNumberOfRounds : getNumberOfRounds,
        dealCards         : dealCards,
        playCard          : playCard,
        isCardAllowed     : isCardAllowed
    }
};
