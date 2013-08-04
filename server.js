var 
	express  = require('express'), 
	pages    = require('./routes/pages'),
	user     = require('./routes/api/user'), 
	http     = require('http'), 
	path     = require('path'), 
	config   = require('./infra/config'), 
	gist     = require('./routes/api/gist'),
	constants= require('./infra/constants').constants,
	//for passport 2013.08.03
	passport = require('passport'),
	// util 	 = require('util'),
	GitHubStrategy = require('passport-github').Strategy;


//2013.08.03
var GITHUB_CLIENT_ID = "794dabc19ea9ed6aba0c"; 
var GITHUB_CLIENT_SECRET = "d37b57ebbb1a9afa20a0b2ba035d2e4d894f5bca";

var app = express();


// 2013.08.03
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// 2013.08.03
// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




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



// 2013.08.03
// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });



// 2013.08.03
// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/welcome' }),
  function(req, res) {
    res.redirect('/');
  });
 



// web pages
//app.get('/', pages.index); // redirect to welcome page if no session
//2013.08.03 
app.get('/', ensureAuthenticated, pages.index);
app.get('/welcome', pages.welcome);


//2013.08.03
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/welcome');
}

// restful services
app.get('/api/user/auth', user.getAuthUser);
app.get('/api/gist/public', gist.getPublicGists);
app.get('/api/gist/user', gist.getGistListByUser);
app.get('/api/gist/starred', gist.getStarredGists);
app.get('/api/gist/rawfiles', gist.getRawFiles);
app.get('/api/gist/rawfile', gist.getRawFile);
app.get('/api/gist/:gistId/comments', gist.getComments);
app.post('/api/gist/:gistId/comments', gist.createComment);
app.get('/api/gist/friends', gist.getFriendsGist);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
