var mongoose = require('mongoose');
var db = require('../infra/dataService').getMongoConnection();

var chatRoomSchema = new mongoose.Schema({
  roomname: String,
  lastLeaveDatetime: String,
  users: [{
    id: Number,
    login: String,
    socketid: String,
    avatar: String,
    url: String
  }]
});

module.exports = db.model('ChatRoom', chatRoomSchema);
