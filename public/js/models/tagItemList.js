define(function(require){
  var
  Backbone  = require('backbone'),
  TagItem     = require('./tagItem'),

  TagItemList = Backbone.Collection.extend({
    model: TagItem,
    initialize: function(props){
      console.log('TagItemList Collection initialized');
    },
    url : function(){
      return "/api/gist/tags";
    }
  })
  ;

  return TagItemList;
});