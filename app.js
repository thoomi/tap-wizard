/**
 * Module dependencies.
 */
var express    = require('express');
var app        = express();
var server     = require('http').createServer(app);
var io         = require('socket.io').listen(server);
var gameserver = require('./game/gameserver.js');


app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    gameserver.initGameServer(io, socket);
});
