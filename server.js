var express = require('express')
  , pages = require('./routes/pages')
  , user = require('./routes/api/user')
  , http = require('http')
  , path = require('path')
  , config = require('./infra/config')
  , gist = require('./routes/api/gist')
  ;

var app = express();

// all environments
app.set('env', config.options.env);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// web pages
app.get('/', pages.index); // redirect to welcome page if no session
app.get('/welcome', pages.welcome);

// restful services



app.get('/api/users/:id', user.getUser);
app.get('/api/gist/public', gist.getPublicGists);
app.get('/api/gist/user', gist.getGistListByUser);
app.get('/api/gist/starred', gist.getStarredGists);
app.get('/api/gist/rawfiles', gist.getRawFiles);
app.get('/api/gist/rawfile', gist.getRawFile);
app.get('/api/gist/:gistId/comments', gist.getComments);
app.post('/api/gist/:gistId/comments', gist.createComment);

/*var server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/

http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
});


/*// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = {};

io.sockets.on('connection', function (socket) {
	
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		//socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		// socket.join('room1');
		// echo to client they've connected
		// socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		// socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		// socket.emit('updaterooms', rooms, 'room1');
		socket.emit('updaterooms', rooms, null);
	});
	
	socket.on('addroom', function(roomname){
		socket.room = roomname;
		rooms[roomname] = roomname;
		socket.join(roomname);

		socket.emit('updatechat', 'SERVER', 'you have connected to ' + roomname);
		// socket.broadcast.to(roomname).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
		socket.emit('updaterooms', rooms, roomname);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});
	
	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});*/