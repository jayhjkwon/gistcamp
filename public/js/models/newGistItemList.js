define(function(require){
  var
  Backbone        = require('backbone'),
  NewGistItem     = require('./newGistItem'),
  NewGistItemList = Backbone.Collection.extend({
      //model : NewGistItem,
      initialize: function(props){
        console.log('newGistItemList init');
      },
    });

  return NewGistItemList;
});