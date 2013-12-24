define(function(require) {
  var
  Backbone = require('backbone'),

    Friend = Backbone.Model.extend({
      initialize: function(options) {
        this.id = options ? options.id || null : null;
        this.mode = options ? options.mode || null : null;
        this.loginId = options ? options.loginId || null : null;
        this.newIndex = options ? options.newIndex || 0 : null;
      },

      url: function() {
        if (this.mode === 'add_watch')
          return '/api/friends/watch/' + this.loginId;
        else if (this.mode === 'remove_watch')
          return '/api/friends/watch/' + this.loginId;
        else if (this.mode === 'sort')
          return '/api/friends/watch/sort/' + this.loginId + '/' + this.newIndex;
      }
    });

  return Friend;
});
