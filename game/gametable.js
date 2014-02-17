var Player = require('./player.js').Player;
var Deck   = require('./deck.js').Deck;

exports.GameTable = function(gameId, host) {
    'use strict';

    var m_gameId            = gameId;
    var m_gameState         = 'waiting';
    var m_deck              = new Deck();
    var m_cardsOnTable      = [];
    var m_host              = host;
    var m_players           = [];
    var m_numberOfPlayers   = 0;
    var m_maxRounds         = 0;
    var m_currentRound      = 1;
    var m_playedTricks      = 0;
    var m_trumpColor        = '';
    var m_firstPlayedCard   = null;
    var m_firstPlayedColor  = '';
    var m_indexOfDealer     = 0;
    var m_lastTrickWinner   = null;
    var m_guessedTrickCount = 0;


    function addPlayer(player) {
        m_players.push(player);
        m_numberOfPlayers++;
    }
    function removePlayer(sessionId) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if(m_players[indexOfPlayer].getId() === sessionId) {
                m_players.splice(indexOfPlayer, 1);
            }
        }

        m_numberOfPlayers--;
    }

    function findPlayerById(id) {
        return m_players[getPlayersIndex(id)];
    }
    function getPlayersIndex(id) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if(m_players[indexOfPlayer].getId() === id) {
                return indexOfPlayer;
            }
        }
        return 0;
    }

    function prepareNewGame() {
        m_players[m_indexOfDealer].emit('playerIsDealer');
        m_gameState = 'running';
    }

    function emitToPlayers(message, data) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            m_players[indexOfPlayer].emit(message, data);
        }
    }

    function dealCards() {

        var numberOfdealedCards = 0;
        // Shuffle card deck
        m_deck.shuffle();

        for (var indexOfTurn = 0; indexOfTurn < m_currentRound; indexOfTurn++) {
            for (var indexOfPlayer = 0; indexOfPlayer < m_numberOfPlayers; indexOfPlayer++) {
                m_players[indexOfPlayer].addCard(m_deck.cards[indexOfTurn * m_numberOfPlayers + indexOfPlayer]);
                m_players[indexOfPlayer].emit('newHandCard', m_deck.cards[indexOfTurn * m_numberOfPlayers + indexOfPlayer]);
                // Count dealed cards
                numberOfdealedCards++;
            }
        }

        // Choose trump card
        var trumpCard = m_deck.cards[numberOfdealedCards];
        if (trumpCard != undefined) {
            m_trumpColor = trumpCard.color;
            m_host.emit('newTrumpCard', trumpCard);
        }

        m_players[getIndexOfDealersNeighbor()].emit('playerBeginTrick');
    }

    function getIndexOfDealersNeighbor() {
        if ((m_indexOfDealer + 1) === m_numberOfPlayers) {
            return 0;
        }
        return m_indexOfDealer + 1;
    }

    function getNumberOfRounds() {
        // Calculate the number of rounds to play
        m_maxRounds = m_deck.numberOfCards / m_numberOfPlayers;

        return m_maxRounds;
    }

    function playerGuessedTricks(number, playerId) {
        var player = findPlayerById(playerId);
        player.setGuessedTricks(m_currentRound, number);

        var data = { playerId : playerId, guessedTricks : number, round: m_currentRound };
        m_host.emit('playerGuessedTricks', data);

        m_guessedTrickCount++;

        // Check if all players guessed their tricks
        if (m_guessedTrickCount === m_numberOfPlayers) {
            emitToPlayers('allTricksGuessed');
            m_guessedTrickCount = 0;
            m_players[getIndexOfDealersNeighbor()].emit('playerBeginTrick');
        }
    }

    function setFirstPlayedColor(color) {
        if(color !== 'wizard' && color !== 'fool') {
            m_firstPlayedColor = color;
        }
    }

    function isCardAllowed(card, playerId) {
        // Check if player already played within this trick
        var player = findPlayerById(playerId);
        if (player.hasPlayedCard()) {
            return false;
        }

        // Check if we have not already a trickwinner and the first card is not played
        if (m_lastTrickWinner === null && m_firstPlayedCard === null) {
            // Check if the player is allowed to play the first card
            if (getIndexOfDealersNeighbor() === getPlayersIndex(playerId)) {
                m_firstPlayedCard = card;
                setFirstPlayedColor(card.color);
                return true;
            }
        }
        else if (m_lastTrickWinner !== null && m_firstPlayedCard === null) {
            // Check if player of the first card is the last trick winner
            if (m_lastTrickWinner.getId() === playerId) {
                m_firstPlayedCard = card;
                setFirstPlayedColor(card.color);
                return true;
            }
        }
        else {
            // Check if the played card is a wizard or a fool
            if (card.color === 'wizard' || card.color === 'fool' ) {
                return true;
            }

            // Check if the suit color is already set
            if (m_firstPlayedColor === '') {
                // Set suit color
                setFirstPlayedColor(card.color);
                return true;
            }

            // Check if card matches suit color
            if (m_firstPlayedColor === card.color) {
                return true
            }

            // Check if player hasn't a matching color
            if (player.hasCardWithColor(m_firstPlayedCard.color) === false)  {
                return true;
            }
        }

        return false;
    }

    function playCard(card, playerId) {
        // Add players id to card
        card.playerId = playerId;

        // Add card to table and notify host
        m_cardsOnTable.push(card);
        m_host.emit('playerHasThrownCard', card);

        // Remove card from player and set that he has played a card
        var player = findPlayerById(playerId);
        player.removeCard(card);
        player.setHasPlayedCard(true);

        // Check if all cards for this round are played
        if (m_cardsOnTable.length === m_numberOfPlayers) {
            calculateTrickWinner();
            m_playedTricks++;

            // Check if the round is over
            if (m_playedTricks === m_currentRound) {
                var points = calculateScores();
                m_currentRound++;

                // Check if game is over
                if (m_currentRound === m_maxRounds) {
                    gameOver();
                }
                else {
                    // Reset values to be ready for a new round
                    m_host.emit('roundIsOver', points);
                    m_playedTricks     = 0;
                    m_firstPlayedCard  = null;
                    m_firstPlayedColor = '';
                    m_lastTrickWinner  = null;
                    m_trumpColor       = '';
                    // Count up dealers index
                    m_indexOfDealer++;
                    if (m_indexOfDealer === m_numberOfPlayers) {
                        m_indexOfDealer = 0;
                    }
                    // Notify the dealer
                    m_players[m_indexOfDealer].emit('playerIsDealer');
                }
            }
        }
    }

    function gameOver() {
        var winner = getGameWinner();
        if (winner != undefined) {
            m_host.emit('gameIsOver', winner.getName());
            emitToPlayers('gameIsOver', winner.getName());
        }

        m_gameState = 'gameover';
    }

    function getGameWinner() {
        var winner = m_players[0];
        for (var indexOfPlayer = 1; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if (winner.getScore() < m_players[indexOfPlayer].getScore()) {
                winner = m_players[indexOfPlayer];
            }
        }
        return winner;
    }

    function calculateScores() {
        var points = {};

        // Calculate the points for the current round
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            var numberOfGuessedTricks = m_players[indexOfPlayer].getGuessedTricks(m_currentRound);
            var numberOfWonTricks = m_players[indexOfPlayer].getWonTricks(m_currentRound);
            var difference = Math.abs(numberOfGuessedTricks - numberOfWonTricks);
            var pointsForPlayer = 0;

            if (difference !== 0) {
                // Player is wrong
                pointsForPlayer = -10 * difference;
            }
            else {
                // Player is right
                pointsForPlayer = 20 + 10 * numberOfWonTricks;
            }

            m_players[indexOfPlayer].addRoundScore(m_currentRound, pointsForPlayer);

            // Save the points into the object by players id
            var playerId = m_players[indexOfPlayer].getId();
            points[playerId] = pointsForPlayer;
        }

        return points;
    }

    function setTrickWinner(playerId) {
        // Get player
        var player = findPlayerById(playerId);
        player.wonTrick(m_currentRound);

        // Notify host and players about the winner
        m_host.emit('playerHasWonTrick', player.getName());
        emitToPlayers('playerHasWonTrick', player.getName());

        m_lastTrickWinner  = player;
        m_cardsOnTable     = [];
        m_firstPlayedCard  = null;
        m_firstPlayedColor = '';
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            m_players[indexOfPlayer].setHasPlayedCard(false);
        }
    }

    function calculateTrickWinner() {
        var foolCount  = 0;
        var comparableCards = [];
        var winnerCard = null;

        for (var indexOfCard = 0; indexOfCard < m_cardsOnTable.length; indexOfCard++) {
            if (m_cardsOnTable[indexOfCard].color === 'wizard') {
                // Wizard detected
                setTrickWinner(m_cardsOnTable[indexOfCard].playerId);
                return;
            }
            else if (m_cardsOnTable[indexOfCard].color === 'fool') {
                // Do nothing and check the next card
                foolCount++;
                if (m_cardsOnTable.length === foolCount) {
                    // Only fools detected
                    setTrickWinner(m_cardsOnTable[0].playerId);
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

        if (m_trumpColor === '' || m_trumpColor === 'wizard' || m_trumpColor === 'fool') {
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
                            // Card is a trump and current winner card is not
                            winnerCard = comparableCards[i];
                        }
                    }
                }
            }
        }

        // Set winner
        setTrickWinner(winnerCard.playerId);
    }

    function getCurrentRound() {
        return m_currentRound;
    }

    function getState() {
        return m_gameState;
    }

    return {
        gameId              : m_gameId,
        host                : m_host,
        addPlayer           : addPlayer,
        removePlayer        : removePlayer,
        getCurrentRound     : getCurrentRound,
        getNumberOfRounds   : getNumberOfRounds,
        dealCards           : dealCards,
        playCard            : playCard,
        isCardAllowed       : isCardAllowed,
        playerGuessedTricks : playerGuessedTricks,
        prepareNewGame      : prepareNewGame,
        gameOver            : gameOver,
        getState            : getState
    }
};
