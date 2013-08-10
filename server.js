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
	GitHubStrategy = require('passport-github').Strategy
;


//2013.08.03
var GITHUB_CLIENT_ID = "ae1eb04aec018fa21176"; 
var GITHUB_CLIENT_SECRET = "6fecc344c5aa4dd89d1b46a7f3f8bc70b60db84b";
var callbackURL;
if(config.options.env === 'development')
  callbackURL = 'http://localhost:3000/auth/github/callback';
else
  callbackURL = 'http://jaykwon-gistcamp.nodejitsu.com/auth/github/callback';

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
app.use(express.session({cookie: { maxAge : 1000 * 60 * 24 * 30 }}));
app.use(passport.initialize());
app.use(passport.session());
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
      // TODO : associate profile and user info in DB      
      // return done(null, profile);
      return done(null, {access_token:accessToken, login:profile._json.login});
    });
  }
));

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
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
app.get('/api/user/auth', ensureAuthenticated, user.getAuthUser);
app.get('/api/gist/public', ensureAuthenticated, gist.getPublicGists);
app.get('/api/gist/user/:login_name', ensureAuthenticated, gist.getGistListByUser);
app.get('/api/gist/starred', ensureAuthenticated, gist.getStarredGists);
app.get('/api/gist/rawfiles', ensureAuthenticated, gist.getRawFiles);
app.get('/api/gist/rawfile', ensureAuthenticated, gist.getRawFile);
app.get('/api/gist/:gistId/comments', ensureAuthenticated, gist.getComments);
app.post('/api/gist/:gistId/comments', ensureAuthenticated, gist.createComment);
app.put('/api/gist/:gistId/comments/:id', ensureAuthenticated, gist.editComment);
app.get('/api/gist/friends', ensureAuthenticated, gist.getFriendsGist);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
