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
  service  = require('./infra/service'),
  async    = require('async'),
  chat     = require('./routes/chat'),
  evernote = require('./routes/api/evernote'),
  connectDomain = require("connect-domain"),
  moment   = require('moment'),
  MongoStore = require('connect-mongo')(express)
;

var app = express();

// TODO : Remove uncaughtexception
/*process.on('uncaughtException', function(err){
  console.error('Caught exception: ' + err);
});*/

var GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET;
var callbackURL;
var mongoUrl;
var cookieParserSecret;
var db;

app.set('env', config.options.env);

if (config.options.env === 'development'){
  GITHUB_CLIENT_ID = constants.GITHUB_CLIENT_ID; 
  GITHUB_CLIENT_SECRET = constants.GITHUB_CLIENT_SECRET;
  callbackURL = 'http://localhost:3000/auth/github/callback';
  mongoUrl = 'mongodb://localhost/gistcamp';
  cookieParserSecret = 'gistcamp';
  app.set('port', 3000);
  cookieMaxAge = 1000 * 60 * 60 * 24 * 30;
  app.use(express.errorHandler());  // development only
}else{
  var github   = require('./githubInfo');
  GITHUB_CLIENT_ID = github.info.GITHUB_CLIENT_ID; 
  GITHUB_CLIENT_SECRET = github.info.GITHUB_CLIENT_SECRET;
  callbackURL = github.info.CALLBACK_URL;
  mongoUrl = github.info.MONGO_URL;
  cookieParserSecret = github.info.COOKIE_PARSET_SECRET;
  app.set('port', 80);
  cookieMaxAge = github.info.COOKIE_MAX_AGE;
}

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

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    // checkRateLimit(req);
    return next(); 
  }
  res.redirect('/welcome');
};

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: cookieParserSecret,
  cookie: { maxAge : cookieMaxAge },
  store: new MongoStore({ url: mongoUrl, auto_reconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());  
// app.use(checkRateLimit);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectDomain());
app.use(function(err, req, res, next) { // error handler middleware should be placed at the bottom of the 'use'
  console.error('Error Occurred: ' + err.stack);
  res.end(500, err.message);
});

/* passport */
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
app.get('/api/server/options', ensureAuthenticated, function(req, res){ res.send(config.options);});
app.get('/api/gist/public', ensureAuthenticated, gist.getPublicGists);
app.get('/api/gist/user/:login_name', ensureAuthenticated, gist.getGistListByUser);

app.get('/api/gists/:gistId', gist.getGistById);
app.get('/api/gist/friends', ensureAuthenticated, gist.getFriendsGist);
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
app.post('/api/friends/watch', ensureAuthenticated, user.addWatch);
app.delete('/api/friends/watch', ensureAuthenticated, user.deleteWatch);
app.get('/api/friends/following', ensureAuthenticated, user.getFollowing);
app.get('/api/friends/followers', ensureAuthenticated, user.getFollowers);


var server = http.createServer(app);
var io = require('socket.io').listen(server);
chat.start(io);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});