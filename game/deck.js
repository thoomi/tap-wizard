var util = require('./util.js');
var Card = require('./card.js').Card;

exports.Deck = function() {
    'use strict';

    var publicApi = {};

    var m_deckOfCards = [
        new Card('red',  1),
        new Card('red',  2),
        new Card('red',  3),
        new Card('red',  4),
        new Card('red',  5),
        new Card('red',  6),
        new Card('red',  7),
        new Card('red',  8),
        new Card('red',  9),
        new Card('red', 10),
        new Card('red', 11),
        new Card('red', 12),
        new Card('red', 13),

        new Card('blue',  1),
        new Card('blue',  2),
        new Card('blue',  3),
        new Card('blue',  4),
        new Card('blue',  5),
        new Card('blue',  6),
        new Card('blue',  7),
        new Card('blue',  8),
        new Card('blue',  9),
        new Card('blue', 10),
        new Card('blue', 11),
        new Card('blue', 12),
        new Card('blue', 13),

        new Card('yellow',  1),
        new Card('yellow',  2),
        new Card('yellow',  3),
        new Card('yellow',  4),
        new Card('yellow',  5),
        new Card('yellow',  6),
        new Card('yellow',  7),
        new Card('yellow',  8),
        new Card('yellow',  9),
        new Card('yellow', 10),
        new Card('yellow', 11),
        new Card('yellow', 12),
        new Card('yellow', 13),

        new Card('green',  1),
        new Card('green',  2),
        new Card('green',  3),
        new Card('green',  4),
        new Card('green',  5),
        new Card('green',  6),
        new Card('green',  7),
        new Card('green',  8),
        new Card('green',  9),
        new Card('green', 10),
        new Card('green', 11),
        new Card('green', 12),
        new Card('green', 13),

        new Card('wizard', 'W'),
        new Card('wizard', 'W'),
        new Card('wizard', 'W'),
        new Card('wizard', 'W'),

        new Card('fool', 'N'),
        new Card('fool', 'N'),
        new Card('fool', 'N'),
        new Card('fool', 'N')
    ];


    publicApi.cards = m_deckOfCards;

    publicApi.numberOfCards = m_deckOfCards.length;

    publicApi.shuffle = function () {
        util.shuffleArray(m_deckOfCards);
    };

    return publicApi;
};
