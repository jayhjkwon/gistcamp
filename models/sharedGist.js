var config   = require('../infra/config');
var mongoose = require('mongoose');

var db;
if (config.options.env === 'development'){
  db = mongoose.createConnection('mongodb://localhost/gistcamp', { server: { poolSize: 5 } });
}else{
  var github   = require('../githubInfo');
  db = mongoose.createConnection(github.info.MONGO_URL, { server: { poolSize: 5 } });
}

var sharedGistSchema = new mongoose.Schema({
  shared_user_login      : String,
  target_user_login      : String,
  gist_id                : String
});

module.exports = db.model('sharedGist', sharedGistSchema);