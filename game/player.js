var Client = require('./client.js').Client;

exports.Player = function(sessionId, name, gameId) {
    'use strict';

    var publicApi       = {};
    publicApi.__proto__ = new Client(sessionId);


    var m_gameId        = gameId;
    var m_name          = name;
    var m_setOfCards    = [];
    var m_perRoundData  = [];
    var m_hasPlayedCard = false;


    publicApi.addCard = function (card) {
        m_setOfCards.push(card);
    }
    publicApi.removeCard = function (card) {
        for (var indexOfCard = 0; indexOfCard < m_setOfCards.length; indexOfCard++) {
            if(m_setOfCards[indexOfCard].color === card.color && m_setOfCards[indexOfCard].value === card.value) {
                m_setOfCards.splice(indexOfCard, 1);
            }
        }
    }

    publicApi.addRoundScore = function (round, roundScore) {
        m_perRoundData[round].score = parseInt(roundScore);
    }

    publicApi.setGuessedTricks = function (round, guessedNumber) {
        m_perRoundData[round] = {};
        m_perRoundData[round].guessedTricks = parseInt(guessedNumber);
        m_perRoundData[round].wonTricks     = 0;
    }
    publicApi.wonTrick = function (round) {
        m_perRoundData[round].wonTricks++;
    }


    publicApi.getWonTricks = function (round) {
        return m_perRoundData[round].wonTricks;
    }
    publicApi.getGuessedTricks = function (round) {
        return  m_perRoundData[round].guessedTricks;
    }

    publicApi.hasCardWithColor = function (color) {
        for (var indexOfCard = 0; indexOfCard < m_setOfCards.length; indexOfCard++) {
            if (m_setOfCards[indexOfCard].color === color) {
                return true;
            }
        }
        return false;
    }

    publicApi.hasPlayedCard = function () {
        return m_hasPlayedCard;
    }
    publicApi.setHasPlayedCard = function (value) {
        m_hasPlayedCard = value;
    }

    publicApi.getName = function () {
        return m_name;
    }

    return publicApi;
};
