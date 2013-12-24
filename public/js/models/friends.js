define(function(require) {
  var
  Backbone = require('backbone'),
    Friend = require('./friend'),

    Friends = Backbone.Collection.extend({
      model: Friend,
      initialize: function(options) {
        this.id = options ? options.id || null : null;
        this.mode = options ? options.mode || null : null;
      },
      url: function() {
        if (this.mode === 'following')
          return '/api/friends/following';
        else if (this.mode === 'followers')
          return '/api/friends/followers'
        else if (this.mode === 'watch')
          return '/api/friends/watch'
      }
    });

  return Friends;
});
