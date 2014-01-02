define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Marionette = require('marionette'),
    Handlebars = require('handlebars'),
    Spinner = require('spin'),
    NoItemsView = require('../noItemsView'),
    constants = require('constants'),
    util = require('util'),
    async = require('async'),
    service = require('service'),
    File = require('models/file'),
    nicescroll = require('nicescroll'),
    FriendsItemView = require('./friendsItemView'),
    Friends = require('models/friends'),
    jqueryuiSortable = require('jqueryuiSortable'),
    postalWrapper = require('postalWrapper'),
    Application = require('application'),
    Friend = require('models/friend'),
    friendsItemListTemplate = require(
      'hbs!templates/friends/friendsItemListTemplate'),
    tipsy = require('tipsy'),

    FriendsItemListView = Marionette.CompositeView.extend({
      template: friendsItemListTemplate,
      className: 'friends-item-container',
      itemViewContainer: function() {
        return this.$el.find('.friends-item-list-sub-container');
      },
      itemView: FriendsItemView,

      initialize: function() {
        _.bindAll(this, 'getWatchingList', 'addWatch', 'removeItemView',
          'onDomRefresh');
        this.collection = new Friends;
        Application.reqres.setHandler(constants.ADD_TO_WATCH, this.addWatch)
        this.on('itemview:close', this.removeItemView);
        $('.friends-item-list').show();
      },

      removeItemView: function(childView, model) {
        this.collection.remove(model);
        console.log('collection length=' + this.collection.length);
      },

      getWatchingList: function() {
        var self = this;
        var friends = new Friends({
          mode: 'watch'
        });
        friends.fetch().done(function(res) {
          self.collection.set(res);
          self.setFirstItemSelect();
        });
      },

      setFirstItemSelect: function() {
        this.$el.find('.row-fluid').first().trigger('click');
      },

      addWatch: function(model) {
        this.isAddedFromFriends = true;
        var beforeLength = this.collection.length;
        var after = this.collection.add(model);
        if (beforeLength !== after.length) {
          return true;
        } else {
          return false;
        }
      },

      onAfterItemAdded: function(itemView) {
        if (this.isAddedFromFriends) {
          itemView.$el.hide().show('bounce');
          var list = document.querySelector('.friends-item-list');
          list.scrollTop = list.scrollHeight;
          this.isAddedFromFriends = false;
        }
        if (window.location.hash.indexOf('friends/gists') > -1) {
          $('.minus').hide();
        } else {
          $('.minus').tipsy({
            gravity: 's',
            fade: true
          });
        }
      },

      onDomRefresh: function() {
        var self = this;
        var firstIndex, updateIndex;

        $('.friends-item-list-sub-container').sortable({
          delay: 100,
          distance: 15,
          tolerance: 'pointer',
          revert: 'invalid',
          placeholder: 'placeholder',
          forceHelperSize: true,
          update: function(event, ui) {
            var index = self.$el.find('.row-fluid').index(self.$el.find(
              '.row-fluid.selected'));
            console.log('update=' + index);
            var loginId = self.$el.find(
              '.row-fluid.selected .friends-item').attr('data-login');
            console.log('loginId=' + loginId);

            var friend = new Friend({
              mode: 'sort',
              loginId: loginId,
              newIndex: index
            });
            friend.save().done(function(res) {

            });
          }
        });
        $('.friends-item-list-sub-container').disableSelection();

        if (window.location.hash.indexOf('friends/gists') > -1) {
          $('.friends-settings-link').tipsy({
            gravity: 'w',
            fade: true
          });
        }

        if (window.location.hash.indexOf('friends/list') > -1) {
          $('.friends-settings-link').hide();
        }
      },

      onRender: function() {
        $('.friends-item-list').niceScroll({
          cursorcolor: '#eee'
        });
      },

      onClose: function() {
        Application.reqres.removeHandler(constants.ADD_TO_WATCH);
        if ($('.tipsy')) $('.tipsy').remove();
      }
    });

  return FriendsItemListView;
});
