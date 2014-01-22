var Player = require('./player.js');

exports.GameTable = function(gameId) {
    'use strict';

    if (typeof(gameId) === 'undefined') { throw "Parameter gameId is not defined!"; }

    var m_gameId  = gameId;
    var m_host    = null;
    var m_players = [];

    function addPlayer(socketId, name) {
        var player = new Player(socketId, m_gameId, name);
        m_players.push(player);
    }
    function removePlayer(socketId) {
        for (var indexOfPlayer = 0; indexOfPlayer < m_players.length; indexOfPlayer++) {
            if(m_players[indexOfPlayer].socketId === socketId) {
                m_players.splice(indexOfPlayer, 1);
            }
        }
    }

    return {
        host : m_host,
        addPlayer : addPlayer,
        removePlayer : removePlayer
    }
};
