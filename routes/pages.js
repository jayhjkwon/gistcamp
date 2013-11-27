var 
	config,
	packageJson = require('../package.json')
;

if (process.env.NODE_ENV === 'production'){
  config = require('../infra/config'); 
}else{
  config = require('../infra/config-dev');
}

exports.index = function(req, res){
  res.render('index', { 
  	devMode: config.env,
  	appVersion: packageJson.version,
    user : req.user
  });
};

exports.welcome = function(req, res){
  res.render('welcome', { 
  	devMode: config.env,
  	appVersion: packageJson.version
  });
};

exports.thanksEvernote = function(req, res){
  res.render('thanksEvernote');
};
