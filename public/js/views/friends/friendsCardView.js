define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Marionette = require('marionette'),
    Application = require('application'),
    constants = require('constants'),
    postalWrapper = require('postalWrapper'),
    friendsCardTemplate = require('hbs!templates/friends/friendsCardTemplate'),
    tipsy = require('tipsy'),
    Friend = require('models/friend'),

    FriendsCardView = Marionette.ItemView.extend({
      template: friendsCardTemplate,
      className: 'row-fluid',

      initialize: function() {
        _.bindAll(this, 'plus');
      },

      events: {
        'click .plus': 'plus'
      },

      plus: function(e) {
        // note that notify first then save it backend
        // TODO: remove watch from the list on the left when error occurs
        var self = this;
        var ack = Application.request(constants.ADD_TO_WATCH, self.model);
        if (ack) {
          var friend = new Friend({
            mode: 'add_watch',
            loginId: this.model.get('login')
          });
          friend.save().done(function(data) {
            self.trigger('close', self.model); // parent view (friendsSearchView) listen this event
          });
        }
      },

      onRender: function() {
        $('.plus').tipsy({
          gravity: 's',
          fade: true
        });
        $('.minus').tipsy({
          gravity: 's',
          fade: true
        });
      },

      onClose: function() {
        if ($('.tipsy')) $('.tipsy').remove();
      }
    });

  return FriendsCardView;
});
