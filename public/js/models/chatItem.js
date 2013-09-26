define(function(require){
  var
  Backbone    = require('backbone'),    
  ChatItem    = Backbone.Model.extend({ 
    initialize: function(props){
      console.log('ChatItem Model initialized');
      this.gistId = props ? props.gistId || '' : '';
    },

    url : function(){
      return 'api/gists/' + this.gistId;
    }   
  })
  ;

  return ChatItem;
});