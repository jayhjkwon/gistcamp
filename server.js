var 
	express  = require('express'), 
	pages    = require('./routes/pages'),
	user     = require('./routes/api/user'), 
	http     = require('http'), 
	path     = require('path'), 
	config   = require('./infra/config'), 
	gist     = require('./routes/api/gist'),
	constants= require('./infra/constants').constants,
	passport = require('passport'),
	GitHubStrategy = require('passport-github').Strategy,
    User     = require('./models/user'), 
    request  = require('request'),
    service   = require('./infra/service')    
;


var GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET;
var callbackURL;

if (config.options.env === 'development'){
	GITHUB_CLIENT_ID = "d992e538e78bc563aae8"; 
	GITHUB_CLIENT_SECRET = "64a09c87fea5e883c5d432b702876b81f8315e4c";
}else{
	var github = require('./githubInfo');
	GITHUB_CLIENT_ID = github.info.GITHUB_CLIENT_ID; 
	GITHUB_CLIENT_SECRET = github.info.GITHUB_CLIENT_SECRET;
}

if(config.options.env === 'development'){
    callbackURL = 'http://localhost:3000/auth/github/callback';
}else{
	var github = require('./githubInfo');
  	callbackURL = github.info.CALLBACK_URL;
}

var app = express();

var checkRateLimit = function(req, res, next){
	var accessToken = service.getAccessToken(req);
	if(accessToken){
		request.get({
			url: config.options.githubHost + '/rate_limit?access_token=' + accessToken,
		}, function(error, response, body){	
			console.log('*******************************************');
			console.log('Rate Limit Checking');
			console.log(body);
			console.log('*******************************************');
		});
	}

	next();
};

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
app.use(express.session({cookie: { maxAge : 1000 * 60 * 24 * 30 }}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(checkRateLimit);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      var userToSave = profile._json;
      userToSave.access_token = accessToken;

      // crate or update
      User.findOneAndUpdate({id: userToSave.id}, userToSave, {upsert:true}, function(err, user){
        return done(null, {access_token:user.access_token, login:user.login, id:user.id});  
      });

    });
  }
));



var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
  	// checkRateLimit(req);
  	return next(); 
  }
  res.redirect('/welcome');
};


// web pages
app.get('/', ensureAuthenticated, pages.index);
app.get('/welcome', pages.welcome);
app.get('/auth/github',
  passport.authenticate('github', {scope: ['user', 'user:email', 'user:follow', 'repo', 'notifications', 'gist']}),
  function(req, res){}
);
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/welcome' }),
  function(req, res) {
    res.redirect('/');
  }
);


// restful services
app.get('/api/server/options', ensureAuthenticated, function(req, res){ res.send(config.options);});
app.get('/api/user/auth', ensureAuthenticated, user.getAuthUser);
app.get('/api/gist/public', ensureAuthenticated, gist.getPublicGists);
app.get('/api/gist/user/:login_name', ensureAuthenticated, gist.getGistListByUser);
app.get('/api/gist/starred', ensureAuthenticated, gist.getStarredGists);
app.post('/api/gist/star/:gist_id', ensureAuthenticated, gist.setStar);
app.get('/api/gist/rawfiles', ensureAuthenticated, gist.getRawFiles);
app.get('/api/gist/rawfile', ensureAuthenticated, gist.getRawFile);
app.get('/api/gist/tagged/:tag_id', ensureAuthenticated, gist.getGistListByTag);
app.put('/api/gist/tagged/:tag_id/:gist_id', ensureAuthenticated, gist.editTagGist);
app.get('/api/gist/:gistId/comments', ensureAuthenticated, gist.getComments);
app.post('/api/gist/:gistId/comments', ensureAuthenticated, gist.createComment);
app.put('/api/gist/:gistId/comments/:id', ensureAuthenticated, gist.editComment);
app.get('/api/gist/friends', ensureAuthenticated, gist.getFriendsGist);
app.get('/api/gist/tags', ensureAuthenticated, gist.getTags);
app.get('/api/gists/:gistId', gist.getGistById);
app.get('/api/gist/tags/:id', ensureAuthenticated, gist.getGistsByTag);
app.post('/api/gist/tags', ensureAuthenticated, gist.createTag);
app.put('/api/gist/tags/:id', ensureAuthenticated, gist.editTag);
app.delete('/api/gist/tags/:id', ensureAuthenticated, gist.removeTag);
app.post('/api/gist/newgist', ensureAuthenticated, gist.createNewgGist);

var server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
// });

Array.prototype.removeById = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i].id == val) {
            this.splice(i, 1);
            break;
        }
    }
}

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = {};

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(user){
		// store the username in the socket session for this client
		socket.userid = user.id;
		// store the room name in the socket session for this client
		//socket.room = 'room1';
		// add the client's username to the global list
		user.socketid = socket.id;
		usernames[user.id] = user;
		// send client to room 1
		// socket.join('room1');
		// echo to client they've connected
		// socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		// socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		// socket.emit('updaterooms', rooms, 'room1');
		
	});

	socket.on('getrooms', function() {
		socket.emit('updaterooms', rooms);
	});
	
	socket.on('addroom', function(roomname){
		socket.room = roomname;

		if (rooms[roomname] == undefined) {
		    rooms[roomname] = new Array();
		}

		rooms[roomname].push(usernames[socket.userid]);
		
		socket.join(roomname);

		socket.emit('updatechat', 'SERVER', 'connected to ' + roomname + ' gist room');
		// socket.broadcast.to(roomname).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
		socket.emit('updaterooms', rooms);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', usernames[socket.userid], data);

		//io.sockets.socket(socket.id).emit('updatealarm', usernames[socket.userid], data);
	});

	socket.on('sendalarm', function (userid, data) {
		var receiver = usernames[userid];
		if (receiver != undefined) {
			io.sockets.socket(receiver.socketid).emit('updatealarm', usernames[socket.userid], data);
		}
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		rooms[socket.room].removeById(socket.userid);

		if (rooms[socket.room].length == 0) {
			delete rooms[socket.room];
		}

		if (rooms[newroom] == undefined) {
		    rooms[newroom] = new Array();
		}

		rooms[newroom].push(usernames[socket.userid]);
		socket.join(newroom);
		
		// socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has left this room');
		
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has joined this room');
		//socket.emit('updaterooms', rooms);
	});

	socket.on('leaveRoom', function(leaveRoom) {
		socket.leave(socket.room);

		if (rooms[socket.room] != undefined) {
			rooms[socket.room].removeById(socket.userid);

			if (rooms[socket.room].length == 0) {
				delete rooms[socket.room];
				socket.broadcast.emit('updaterooms', rooms);
			}	
		}
		

		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', usernames[socket.userid].login + ' has left this room');
	});
	
	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		var userid = socket.userid;
		delete usernames[socket.userid];
		// update list of users in chat, client-side
		// io.sockets.emit('updateusers', usernames[socket.userid]);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', userid + ' has disconnected');
		socket.leave(socket.room);
	});
});
