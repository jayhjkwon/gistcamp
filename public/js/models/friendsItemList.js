define(function(require){
  var
  Backbone = require('backbone'),   
  
  FriendsItemList = Backbone.Model.extend({
    initialize: function(options){
      this.id = options ? options.id || null : null;
    }     
  })
  ;

  return FriendsItemList;
});