var 
  express  = require('express'), 
  pages    = require('./routes/pages'),
  user     = require('./routes/api/user'), 
  http     = require('http'), 
  path     = require('path'),   
  gist     = require('./routes/api/gist'),
  passport = require('passport'),
  GitHubStrategy = require('passport-github').Strategy,
  User     = require('./models/user'), 
  request  = require('request'),
  service  = require('./infra/service'),
  async    = require('async'),
  chat     = require('./routes/chat'),
  evernote = require('./routes/api/evernote'),
  moment   = require('moment'),
  MongoStore = require('connect-mongo')(express),
  config
;

var app = express();

// TODO : Remove uncaughtexception
/*process.on('uncaughtException', function(err){
  console.error('Uncaught exception: ' + err.stack);
  process.exit(1);
});*/


if (process.env.NODE_ENV === 'production'){
  config = require('./infra/config'), 
  app.use(express.errorHandler());
}else{
  config = require('./infra/config-dev'), 
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));  
}

var gistampLocals = function(req, res, next) {
    res.locals = res.locals || {};
    res.locals.csrfToken = req.session._csrf;
    next();
};

var checkRateLimit = function(req, res, next){
  var accessToken = service.getAccessToken(req);
  if(accessToken){
    request.get({
      url: config.githubHost + '/rate_limit?access_token=' + accessToken,
    }, function(error, response, body){ 
      console.log('*******************************************');
      console.log('Rate Limit Checking');
      console.log(body);
      console.log('*******************************************');
    });
  }

  next();
};

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    next(); 
  }else{
    res.redirect('/welcome');  
  }  
};

var forceHttps = function(req, res, next){
  // res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');

  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('************ forcing https ***********');
    return res.redirect(301, 'https://' + req.headers.host + '/');
  }

  next();
};


/* middlewares */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'production'){
  app.use(forceHttps);
}
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: config.COOKIE_PARSET_SECRET,
  cookie: { maxAge : config.COOKIE_MAX_AGE }
}));
app.use(passport.initialize());
app.use(passport.session());  
// app.use(checkRateLimit);
app.use(app.router);
app.use(express.csrf());
app.use(gistampLocals);
app.use(express.static(path.join(__dirname, 'public')));



/* passport */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID    : config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL : config.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    var userToSave = profile._json;
    userToSave.access_token = accessToken;

    async.parallel([
      function(cb){
       user.getAllFollowings(null, null, accessToken, function(followings){
        userToSave.followings = followings;
        cb(null);
      });
     },
     function(cb){
      gist.getAllStarredGists(null, null, accessToken, function(allStarredGists){
        userToSave.starred_gists = allStarredGists;
        cb(null);
      });           
    },
    function(cb){
      User.findOne({id:userToSave.id}, function(err, doc){
        if(!doc){
          userToSave.gistcamp_joindate = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        }
        cb(null);
      });
    }
    ],
    function(err, results){            
     User.findOneAndUpdate({id: userToSave.id}, userToSave, {upsert:true}, function(err, userInfo){
       return done(null, {access_token:userInfo.access_token, login:userInfo.login, id:userInfo.id});   
     });            
   }
   );       
  });
}
));

/* web pages */
app.get('/', ensureAuthenticated, pages.index);
app.get('/welcome', pages.welcome);
app.get('/thanksEvernote', pages.thanksEvernote);
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
app.get('/logout', function(req, res){
  req.logout();
  // req.session.destroy();
  res.redirect('/welcome');
});
app.get('/auth/evernote', evernote.auth);
app.get('/auth/evernote/callback', evernote.authCallback);


/* restful services */
app.get('/api/server/options', ensureAuthenticated, function(req, res){ res.send({env: config.env});});
app.get('/api/gist/public', ensureAuthenticated, gist.getPublicGists);
app.get('/api/gist/user/:login_name', ensureAuthenticated, gist.getGistListByUser);

app.get('/api/gists/:gistId', gist.getGistById);
// app.get('/api/gist/friends', ensureAuthenticated, gist.getFriendsGist);
app.get('/api/gist/starred', ensureAuthenticated, gist.getStarredGists);

app.get('/api/gist/shared/:login_name', ensureAuthenticated, gist.getSharedGists);
app.post('/api/gist/shared/:gist_id/:users', ensureAuthenticated, gist.setSharedGists);

app.post('/api/gist/star/:gist_id', ensureAuthenticated, gist.setStar);
app.delete('/api/gist/star/:gist_id', ensureAuthenticated, gist.deleteStar);

app.get('/api/gist/rawfiles', ensureAuthenticated, gist.getRawFiles);
app.get('/api/gist/rawfile', ensureAuthenticated, gist.getRawFile);

app.get('/api/gist/tagged/:tag_id', ensureAuthenticated, gist.getGistListByTag);
app.put('/api/gist/tagged/:tag_id/:gist_id', ensureAuthenticated, gist.setTagOnGist);
app.delete('/api/gist/tagged/:tag_id/:gist_id', ensureAuthenticated, gist.deleteTagOnGist);

app.get('/api/gist/:gistId/comments', ensureAuthenticated, gist.getComments);
app.post('/api/gist/:gistId/comments', ensureAuthenticated, gist.createComment);
app.put('/api/gist/:gistId/comments/:id', ensureAuthenticated, gist.editComment);
app.delete('/api/gist/:gistId/comments/:id', ensureAuthenticated, gist.deleteComment);

app.get('/api/gist/tags', ensureAuthenticated, gist.getTags);
app.get('/api/gist/tags/:id', ensureAuthenticated, gist.getGistsByTag);
app.post('/api/gist/tags', ensureAuthenticated, gist.createTag);
app.put('/api/gist/tags/:id', ensureAuthenticated, gist.editTag);
app.delete('/api/gist/tags/:id', ensureAuthenticated, gist.removeTag);

app.post('/api/gist/newgist', ensureAuthenticated, gist.createNewgGist);
app.delete('/api/gist/newgist/:id', ensureAuthenticated, gist.deleteGist);

app.get('/api/user/auth', ensureAuthenticated, user.getAuthUser);
app.put('/api/user/following/:login_id', ensureAuthenticated, user.follow);
app.delete('/api/user/following/:login_id', ensureAuthenticated, user.unfollow);

app.post('/api/evernote/save/:gist_id', ensureAuthenticated, evernote.saveNote);
app.get('/api/evernote/is_authenticated', ensureAuthenticated, evernote.isEvernoteAuthenticated);

app.get('/api/friends/watch', ensureAuthenticated, user.getWatch);
app.post('/api/friends/watch/:login_id', ensureAuthenticated, user.addWatch);
app.delete('/api/friends/watch/:login_id', ensureAuthenticated, user.deleteWatch);
app.post('/api/friends/watch/sort/:login_id/:new_index', ensureAuthenticated, user.sortWatch);
app.get('/api/friends/following', ensureAuthenticated, user.getFollowing);
app.get('/api/friends/followers', ensureAuthenticated, user.getFollowers);



var server = http.createServer(app);
var io = require('socket.io').listen(server);
chat.start(io);
server.listen(config.PORT, function(){
  console.log('Express server listening on port ' + config.PORT);
});