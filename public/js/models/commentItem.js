define(function(require) {
  var
  Backbone = require('backbone'),
    CommentItem = Backbone.Model.extend({
      initialize: function(props) {
        console.log('CommentItem Model initialized');
        this.gistId = props ? props.gistId || null : null;
        this.id = props ? props.id || null : null;
      },

      url: function() {
        if (this.id) {
          return '/api/gist/' + this.gistId + '/comments/' + this.id;
        } else {
          return '/api/gist/' + this.gistId + '/comments';
        }
      }
    });

  return CommentItem;
});
