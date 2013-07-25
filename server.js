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
app.get('/api/users', user.getUserList);
app.get('/api/users/:id', user.getUser);
app.post('/api/users', user.save);
app.delete('/api/users/:id', user.removeUser);
app.get('/api/gist/public', gist.getPublicGists);
app.get('/api/gist/user', gist.getGistListByUser);
app.get('/api/gist/starred', gist.getStarredGists);
app.get('/api/gist/rawfiles', gist.getRawFiles);
app.get('/api/gist/rawfile', gist.getRawFile);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
