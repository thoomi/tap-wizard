var Client = require('./client.js').Client;

exports.Player = function(sessionId, name) {
    'use strict';

    var publicApi       = {};
    publicApi.__proto__ = new Client(sessionId);

    var m_name          = name;
    var m_setOfCards    = [];
    var m_perRoundData  = [];
    var m_score         = 0;


    publicApi.hasPlayedCard = false;

    publicApi.addCard = function (card) {

        m_setOfCards.push(card);
    };
    publicApi.removeCard = function (card) {
        for (var indexOfCard = 0; indexOfCard < m_setOfCards.length; indexOfCard++) {
            if(m_setOfCards[indexOfCard].color === card.color && m_setOfCards[indexOfCard].value === card.value) {
                m_setOfCards.splice(indexOfCard, 1);
            }
        }
    };

    publicApi.calculateRoundScore = function (round) {
        var guessedTricks = m_perRoundData[round].guessedTricks;
        var wonTricks     = m_perRoundData[round].wonTricks;
        var difference    = Math.abs(guessedTricks - wonTricks);
        var roundScore    = 0;

        if (difference !== 0) {
            // Player is wrong
            roundScore = -10 * difference;
        }
        else {
            // Player is right
            roundScore = 20 + 10 * wonTricks;
        }

        m_perRoundData[round].score = roundScore;
        m_score += parseInt(roundScore);
    };
    publicApi.getRoundScore = function(round) {

        return m_perRoundData[round].score;
    };
    publicApi.getFullScore = function() {

        return m_score;
    };

    publicApi.setGuessedTricks = function (round, guessedNumber) {
        m_perRoundData[round] = {};
        m_perRoundData[round].guessedTricks = parseInt(guessedNumber);
        m_perRoundData[round].wonTricks     = 0;
    };
    publicApi.addWonTrick = function (round) {

        m_perRoundData[round].wonTricks++;
    };

    publicApi.hasCardWithSuit = function (suit) {
        for (var indexOfCard = 0; indexOfCard < m_setOfCards.length; indexOfCard++) {
            if (m_setOfCards[indexOfCard].suit === suit) {
                return true;
            }
        }
        return false;
    };

    publicApi.getName = function () {

        return m_name;
    };

    return publicApi;
};
