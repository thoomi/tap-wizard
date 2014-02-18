exports.Card = function(suit, value) {
    'use strict';

    var publicApi = {};

    if (typeof(suit) === 'undefined') { suit = 'default'; }
    if (typeof(value) === 'undefined') { value = -1; }

    publicApi.suit  = suit;
    publicApi.value = value;

    return publicApi;
};
