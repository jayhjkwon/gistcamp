var mongoose = require('mongoose');
var db = require('../infra/dataService').getMongoConnection();

var chatContentSchema = new mongoose.Schema({
  room_key        : String, // unique
  user_id         : Number,
  user_login      : String,
  avatar_url      : String,
  content         : String,  
  created_at      : String
});

module.exports = db.model('ChatContent', chatContentSchema);