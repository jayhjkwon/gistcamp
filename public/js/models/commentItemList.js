define(function(require) {
  var
  Backbone = require('backbone'),
    constants = require('constants'),
    CommentItem = require('./commentItem'),
    CommentItemList = Backbone.Collection.extend({
      model: CommentItem,
      initialize: function(props) {
        console.log('CommentItemList Collection initialized');
        this.gistId = props ? props.gistId || '' : '';
      },
      url: function() {
        return '/api/gist/' + this.gistId + '/comments';
      }
    });

  return CommentItemList;
});
