exports.Player = function(socket, gameId, name) {
    'use strict';

    if (typeof(socket) === 'undefined') { throw "Parameter socket is not defined!"; }
    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }
    if (typeof(name) === 'undefined') { throw "Parameter name is not defined!"; }

    var m_socket     = socket;
    var m_gameId     = gameId
    var m_name       = name;
    var m_setOfCards = [];
    var m_score      = 0;


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
        m_score += parseInt(points);
    }
    function removePoints(points) {
        m_score -= parseInt(points);
    }

    return {
        socket     : m_socket,
        gameId     : m_gameId,
        name       : m_name,
        score      : m_score,
        addCard    : addCard,
        removeCard : removeCard
    }
};
