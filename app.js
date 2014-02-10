/**
 * Module dependencies.
 */
var express    = require('express');
var app        = express();
var server     = require('http').createServer(app);
var io         = require('socket.io').listen(server);
var gameserver = require('./game/gameserver.js');
var path 	   = require('path');
var fs         = require('fs');

app.set('port', process.env.PORT || 3000);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


// Listen for Socket.IO Connections. Once connected, listen to messages.
io.sockets.on('connection', function (socket) {
    gameserver.initializeListeners(io, socket);
});
