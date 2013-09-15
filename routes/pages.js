var 
	config = require('../infra/config'),
	packageJson = require('../package.json')
;

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Welcome to GistCamp',
  	devMode: config.options.env,
  	appVersion: packageJson.version,
    user : req.user
  });
};

exports.welcome = function(req, res){
  res.render('welcome', { 
  	title: 'Welcome to GistCamp',
  	devMode: config.options.env,
  	appVersion: packageJson.version
  });
};
