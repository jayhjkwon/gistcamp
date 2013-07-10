var express = require('express')
  , pages = require('./routes/pages')
  , user = require('./routes/api/user')
  , http = require('http')
  , path = require('path')
  , config = require('./infra/config')  
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
app.get('/rest/users', user.getUserList);
app.get('/rest/users/:id', user.getUser);
app.post('/rest/users', user.save);
app.delete('/rest/users/:id', user.removeUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
