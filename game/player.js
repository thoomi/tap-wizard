exports.Player = function(socket, gameId, name) {
    'use strict';

    if (typeof(socket) === 'undefined') { throw "Parameter socket is not defined!"; }
    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }
    if (typeof(name) === 'undefined') { throw "Parameter name is not defined!"; }

    var m_socket        = socket;
    var m_gameId        = gameId;
    var m_name          = name;
    var m_setOfCards    = [];
    var m_score         = 0;
    var m_guessedTricks = 0;
    var m_currentTricks = 0;


    function addCard(card) {
        m_setOfCards.push(card);
    }
    function removeCard(card) {
        for (var indexOfCard = 0; indexOfCard < m_setOfCards.length; indexOfCard++) {
            if(m_setOfCards[indexOfCard].color === card.color && m_setOfCards[indexOfCard].value === card.value) {
                m_setOfCards.splice(indexOfCard, 1);
            }
        }
    }

    function addPoints(points) {
        m_score += Math.abs(parseInt(points));
    }
    function removePoints(points) {
        m_score -= Math.abs(parseInt(points));
    }

    function setGuessedTricks(guessedNumber) {
        m_guessedTricks = parseInt(guessedNumber);
    }
    function addTrick() {
        m_currentTricks++;
    }
    function clearTricks() {
        m_guessedTricks = 0;
        m_currentTricks = 0;
    }

    function getCurrentTricks() {
        return m_currentTricks;
    }
    function getGuessedTricks() {
        return m_guessedTricks;
    }

    function getCards() {
        return m_setOfCards;
    }

    return {
        socket           : m_socket,
        gameId           : m_gameId,
        name             : m_name,
        addCard          : addCard,
        removeCard       : removeCard,
        addTrick         : addTrick,
        clearTricks      : clearTricks,
        setGuessedTricks : setGuessedTricks,
        getCurrentTricks : getCurrentTricks,
        getGuessedTricks : getGuessedTricks,
        addPoints        : addPoints,
        removePoints     : removePoints,
        getCards         : getCards
    }
};
