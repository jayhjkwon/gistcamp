var 
	config = require('../infra/config'),
	packageJson = require('../package.json')
;

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Express',
  	devMode: config.options.env,
  	appVersion: packageJson.version
  });
};