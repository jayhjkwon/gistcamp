define(function(require){
  var
  Backbone = require('backbone'),   
  
  File     = Backbone.Model.extend({
    url : function(){
      return "/api/gist/rawfile";
    }     
  })
  ;

  return File;
});