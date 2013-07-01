var config = require('../infra/config');

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Express',
  	devMode: config.options.env 
  });
};