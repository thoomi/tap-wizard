var Client = require('./client.js').Client;

exports.Host = function(sessionId) {
    'use strict';

    var publicApi       = {};
    publicApi.__proto__ = new Client(sessionId);

    return publicApi;
};
