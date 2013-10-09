var mongoose = require('mongoose');
var db = require('../infra/dataService').getMongoConnection();

var sharedGistSchema = new mongoose.Schema({
  shared_user_login      : String,
  target_user_login      : String,
  gist_id                : String
});

module.exports = db.model('sharedGist', sharedGistSchema);