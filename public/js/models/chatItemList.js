define(function(require) {
  var
  Backbone = require('backbone'),
    constants = require('constants'),
    ChatItem = require('./chatItem'),
    ChatItemList = Backbone.Collection.extend({
      model: ChatItem
    });

  return ChatItemList;
});
