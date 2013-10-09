var config   = require('./config');
var mongoose = require('mongoose');

exports.getMongoConnection = function(){
  var db;
  var opts = {
    server: { 
      auto_reconnect: true,
      poolSize: 10
    }
  }

  if (config.options.env === 'development'){
    db = mongoose.createConnection('mongodb://localhost/gistcamp', opts);
  }else{
    var github   = require('../githubInfo');
    db = mongoose.createConnection(github.info.MONGO_URL, opts);
  }

  return db;
}