var 
	config = require('../infra/config'),
	packageJson = require('../package.json')
;

exports.index = function(req, res){
  var code = req.param('code') ; 
  console.log(code);


  res.render('index', { 
  	title: 'Welcome to GistCamp',
  	devMode: config.options.env,
  	appVersion: packageJson.version
  });
};

exports.welcome = function(req, res){
  res.render('welcome', { 
  	title: 'Welcome to GistCamp',
  	devMode: config.options.env,
  	appVersion: packageJson.version
  });
};