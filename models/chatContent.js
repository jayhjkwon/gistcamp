var config   = require('../infra/config');
var mongoose = require('mongoose');

var db;
if (config.options.env === 'development'){
  db = mongoose.createConnection('mongodb://localhost/gistcamp', { server: { poolSize: 5 } });
}else{
  var github   = require('../githubInfo');
  db = mongoose.createConnection(github.info.MONGO_URL, { server: { poolSize: 5 } });
}

var chatContentSchema = new mongoose.Schema({
  room_key        : String, // unique
  user_id         : Number,
  user_login      : String,
  avatar_url      : String,
  content         : String,  
  created_at      : String
});

module.exports = db.model('ChatContent', chatContentSchema);