var 
	config = require('../infra/config'),
	packageJson = require('../package.json')
;

exports.index = function(req, res){
  res.render('index', { 
  	devMode: config.options.env,
  	appVersion: packageJson.version,
    user : req.user
  });
};

exports.welcome = function(req, res){
  res.render('welcome', { 
  	devMode: config.options.env,
  	appVersion: packageJson.version
  });
};

exports.thanksEvernote = function(req, res){
  res.render('thanksEvernote');
};
