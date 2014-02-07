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

    function emitToPlayers(message, data) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            m_players[indexOfPlayer].socket.emit(message, data);
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

    function playerGuessedTricks(number, socketId) {
        var player = findPlayerBySocketId(socketId);
        player.setGuessedTricks(number);
        var data = { socketId : socketId, guessedTricks : number };
        m_hostSocket.emit('playerGuessedTricks', data);
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
                        if (playerCards[indexOfPlayerCards].color == searchedColor) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    function playCard(card, socketId) {
        // Add players socket id to card
        card.playerSocketId = socketId;

        // Add card to table and notify host
        m_cardsOnTable.push(card);
        m_hostSocket.emit('playerHasThrownCard', card);

        // Remove card from player
        findPlayerBySocketId(socketId).removeCard(card);

        // Check if all cards for this round are played
        if (m_cardsOnTable.length === m_numberOfPlayers) {
            calculateTrickWinner();
            m_playedTricks++;

            // Check if the round is over
            if (m_playedTricks === m_currentRound) {
                // TODO: Calculate points
                var points = calculateScores();

                m_currentRound++;

                // Check if game is over
                if (m_currentRound === m_maxRounds) {
                    // TODO: game is over logic
                }
                else {
                    m_hostSocket.emit('roundIsOver', points);
                    m_playedTricks = 0;
                    m_trumpColor = '';
                }
            }
        }
    }

    function calculateScores() {
        var points = {};

        // Calculate the points for the current round
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            var numberOfGuessedTricks = m_players[indexOfPlayer].getGuessedTricks();
            var numberOfCurrentTricks = m_players[indexOfPlayer].getCurrentTricks();
            var difference = Math.abs(numberOfGuessedTricks - numberOfCurrentTricks);
            var pointsForPlayer = 0;

            if (difference != 0) {
                // Player is wrong
                pointsForPlayer = -10 * difference;
                m_players[indexOfPlayer].removePoints(pointsForPlayer);
            }
            else {
                // Player is right
                pointsForPlayer = 20 + 10 * numberOfCurrentTricks;
                m_players[indexOfPlayer].addPoints(pointsForPlayer);
            }

            // Save the points into the object by players socketId
            var socketId = m_players[indexOfPlayer].socket.id;
            points[socketId] = pointsForPlayer;

            // Reset players tricks
            m_players[indexOfPlayer].clearTricks();
        }

        return points;
    }

    function setTrickWinner(socketId) {
        // Get player
        var winner = findPlayerBySocketId(socketId);
        winner.addTrick();

        // Notify host and players about the winner
        m_hostSocket.emit('playerHasWonTrick', winner.name);
        emitToPlayers('playerHasWonTrick', winner.name);

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


        if (m_trumpColor == '' || m_trumpColor == 'wizard' || m_trumpColor == 'fool') {
            for (var i = 1; i < comparableCards.length; i++) {
                // Check if color is the same
                if(comparableCards[i].color === winnerCard.color) {
                    // Check if value is higher
                    if(comparableCards[i].value > winnerCard.value) {
                        winnerCard = comparableCards[i];
                    }
                }
            }
        }
        else {
            for (var i = 1; i < comparableCards.length; i++) {
                // Check if color is the same
                if(comparableCards[i].color === winnerCard.color) {
                    // Check if value is higher
                    if(comparableCards[i].value > winnerCard.value) {
                        winnerCard = comparableCards[i];
                    }
                }
                else {
                    // Check if card is a trump
                    if (comparableCards[i].color === m_trumpColor) {
                        // Check if current winner card is a trump
                        if (winnerCard.color === m_trumpColor) {
                            // Both cards are trumps; Compare the values
                            if (comparableCards[i].value > winnerCard.value) {
                                winnerCard = comparableCards[i];
                            }
                        }
                        else {
                            // Card is a trump and current winner card not
                            winnerCard = comparableCards[i];
                        }
                    }
                }

            }
        }



        // Set winner
        setTrickWinner(winnerCard.playerSocketId);
    }

    function getCurrentRound() {
        console.log('Round: ' + m_currentRound);
        return m_currentRound;
    }

    return {
        gameId            : m_gameId,
        hostSocket        : m_hostSocket,
        addPlayer         : addPlayer,
        removePlayer      : removePlayer,
        getCurrentRound   : getCurrentRound,
        getNumberOfRounds : getNumberOfRounds,
        dealCards         : dealCards,
        playCard          : playCard,
        isCardAllowed     : isCardAllowed,
        playerGuessedTricks : playerGuessedTricks
    }
};
