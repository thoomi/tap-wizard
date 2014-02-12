/**
 * Module dependencies.
 */
var express      = require('express');
var app          = express();
var server       = require('http').createServer(app);
var io           = require('socket.io').listen(server);
var sio          = require('session.socket.io');
var gameserver   = require('./game/gameserver.js');
var path         = require('path');
var fs           = require('fs');
var connect      = require('connect');


var cookieParser = express.cookieParser('0123456789');
var sessionStore = new connect.middleware.session.MemoryStore();


app.set('port', process.env.PORT || 3000);

app.use(cookieParser);
app.use(express.session({ secret: '0123456789', store: sessionStore }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


var sessionSockets = new sio(io, sessionStore, cookieParser);


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

// Development
/*
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/client/app/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});*/


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


// Listen for Socket.IO Connections. Once connected, listen to messages.
sessionSockets.on('connection', function (err, socket, session) {

    if (err == null && session != undefined) {
        console.log('Session: ' +  session.id);
        gameserver.initializeListeners(io, socket, sessionSockets);
    }
    else {
        // Send error to client
        socket.emit('error', err);
    }
});
