/**
 * Module dependencies.
 */
var express    = require('express');
var fs         = require('fs');
var GameServer = require('./game/gameserver.js');
var http       = require('http');
var path       = require('path');
var socketIo   = require('socket.io');
var sSocketIo  = require('session.socket.io');


/**
 * Cookie parser and session store setup
 */
var cookieParser = express.cookieParser('tapWizard');
var sessionStore = new express.session.MemoryStore();


/**
 * Express server, http server and socket.io setup
 */
var app    = express();
var server = http.createServer(app);
var io     = socketIo.listen(server);
var sio    = new sSocketIo(io, sessionStore, cookieParser);


/**
 * Setup some express use values
 */
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({ secret: 'tapWizard', store: sessionStore }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);


/**
 * Define which static files to serve in dev end prod mode
 */
app.configure('development', function() {
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/client/app/index.html', 'utf8', function(err, text){
            res.send(text);
        });
    });
});

app.configure('production', function() {
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
            res.send(text);
        });
    });
});


/**
 * Listen to events on specified port
 */
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


/**
* Initialize a game server
*/
var gameServer = new GameServer(sio, io);
gameServer.setup();
