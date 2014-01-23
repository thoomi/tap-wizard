var Util = require('./util.js');
var Card = require('./card.js').Card;

exports.Deck = function() {
    'use strict';

    var m_deckOfCards = [
        Card('red', 1 ),
        Card('red', 2 ),
        Card('red', 3 ),
        Card('red', 4 ),
        Card('red', 5 ),
        Card('red', 6 ),
        Card('red', 7 ),
        Card('red', 8 ),
        Card('red', 9 ),
        Card('red', 10),
        Card('red', 11),
        Card('red', 12),
        Card('red', 13),

        Card('blue', 1 ),
        Card('blue', 2 ),
        Card('blue', 3 ),
        Card('blue', 4 ),
        Card('blue', 5 ),
        Card('blue', 6 ),
        Card('blue', 7 ),
        Card('blue', 8 ),
        Card('blue', 9 ),
        Card('blue', 10),
        Card('blue', 11),
        Card('blue', 12),
        Card('blue', 13),

        Card('yellow', 1 ),
        Card('yellow', 2 ),
        Card('yellow', 3 ),
        Card('yellow', 4 ),
        Card('yellow', 5 ),
        Card('yellow', 6 ),
        Card('yellow', 7 ),
        Card('yellow', 8 ),
        Card('yellow', 9 ),
        Card('yellow', 10),
        Card('yellow', 11),
        Card('yellow', 12),
        Card('yellow', 13),

        Card('green', 1 ),
        Card('green', 2 ),
        Card('green', 3 ),
        Card('green', 4 ),
        Card('green', 5 ),
        Card('green', 6 ),
        Card('green', 7 ),
        Card('green', 8 ),
        Card('green', 9 ),
        Card('green', 10),
        Card('green', 11),
        Card('green', 12),
        Card('green', 13),

        Card('wizard', 99),
        Card('wizard', 99),
        Card('wizard', 99),
        Card('wizard', 99),

        Card('fool', 0),
        Card('fool', 0),
        Card('fool', 0),
        Card('fool', 0)
    ];

    function shuffle() {
        Util.shuffleArray(m_deckOfCards);
    }

    return {
        deckOfCards   : m_deckOfCards,
        numberOfCards : m_deckOfCards.length,
        shuffle       : shuffle
    }
};
