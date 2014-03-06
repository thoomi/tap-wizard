exports.Client = function(sessionId) {
    'use strict';

    var publicApi = {};

    var m_id     = sessionId;
    var m_socket = null;


    publicApi.getId = function() {
        return m_id;
    };

    publicApi.setSocket = function (socket) {
        m_socket = socket;
    };
    publicApi.getSocket = function () {
        return m_socket;
    };

    publicApi.emit = function (message, data) {
        if (m_socket != null) {
            m_socket.emit(message, data);
        }
        else {
            console.log('Message not sent!');
            console.log('Socket: ' + m_socket);
        }
    };

    return publicApi;
};
