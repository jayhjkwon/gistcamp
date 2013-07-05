var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/rest/user')
  , http = require('http')
  , path = require('path')
  , config = require('./infra/config')
  ;

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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
app.use(express.session());
// app.use(allowCrossDomain);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.use(require('less-middleware')({ src: __dirname + '/public-dev' }));
  app.use(express.static(path.join(__dirname, 'public-dev')));
}else if ('production' == app.get('env')) {
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
}*/

app.get('/', routes.index);
app.get('/rest/users', user.getUserList);
app.get('/rest/users/:id', user.getUser);
app.post('/rest/users', user.save);
app.delete('/rest/users/:id', user.removeUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
