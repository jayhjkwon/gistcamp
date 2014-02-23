define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Marionette = require('marionette'),
    gistItemTemplate = require('hbs!templates/gistItemTemplate'),
    Application = require('application'),
    constants = require('constants'),
    postalWrapper = require('postalWrapper'),
    User = require('models/user'),

    GistItemView = Marionette.ItemView.extend({
      template: gistItemTemplate,
      className: 'row-fluid',
      isSelectedGist: false,

      initialize: function() {
        var self = this;
        _.bindAll(this, 'onUserFollowChanged', 'onGistItemSelected',
          'onTagChanged', 'onClose', 'setIsSelectedGistFalse',
          'onFollowUserClicked', 'onCommentDeleted', 'onCommentAdded',
          'onStarChanged');
        this.subscription = postalWrapper.subscribe(constants.TAG_CHANGED,
          this.onTagChanged);
        this.subscriptionRemoveIsSelected = postalWrapper.subscribe(
          constants.REMOVE_IS_SELECTED, this.setIsSelectedGistFalse);
        this.subscriptionDeleteComment = postalWrapper.subscribe(constants.COMMENT_DELETE,
          this.onCommentDeleted);
        this.subscriptionAddComment = postalWrapper.subscribe(constants.COMMENT_ADD,
          this.onCommentAdded);
        this.subscriptionStar = postalWrapper.subscribe(constants.GIST_STAR_CHANGED,
          this.onStarChanged);
        this.subscriptionUserFollow = postalWrapper.subscribe(constants.USER_FOLLOW,
          this.onUserFollowChanged);
        this.subscriptionUserUnFollow = postalWrapper.subscribe(constants.USER_UNFOLLOW,
          this.onUserFollowChanged);
      },

      events: {
        'click .gist-item': 'onGistItemSelected',
        'click .follow-user': 'onFollowUserClicked'
      },

      ui: {
        btnFollow: '.follow-user'
      },

      onRender: function() {
        if (window.location.hash.indexOf('friends/gists') > -1) {
          this.$el.find('.gist-item .span3').addClass('hide-span3');
          this.$el.find('.gist-item .span9').removeClass('span9').addClass(
            'span12');
          this.$el.find('.login-id').hide();
        }
      },

      onUserFollowChanged: function(user) {
        if (this.model.toJSON().user.id === user.id) {
          this.model.toJSON().user.is_following_this_user = user.is_following_this_user;
          if (user.is_following_this_user) {
            this.ui.btnFollow.text('Unfollow');
          } else {
            this.ui.btnFollow.text('Follow');
          }
        }
      },

      onFollowUserClicked: function(e) {
        var self = this;
        var userModel;
        var user = this.model.toJSON().user;
        this.ui.btnFollow.prop('disabled', true);
        if (this.ui.btnFollow.text() === 'Follow') {
          userModel = new User({
            mode: constants.USER_FOLLOW,
            id: user.id,
            loginId: user.login
          });
          userModel.save().done(function() {
            self.ui.btnFollow.prop('disabled', false);
            self.ui.btnFollow.text('Unfollow');
            user.is_following_this_user = true;
            postalWrapper.publish(constants.USER_FOLLOW, user);
          });
        } else {
          userModel = new User({
            mode: constants.USER_UNFOLLOW,
            id: user.id,
            loginId: user.login
          });
          userModel.destroy({
            success: function() {
              self.ui.btnFollow.prop('disabled', false);
              self.ui.btnFollow.text('Follow');
              user.is_following_this_user = false;
              postalWrapper.publish(constants.USER_UNFOLLOW, user);
            }
          });
        }
      },

      setIsSelectedGistFalse: function(context) {
        if (context !== this) {
          this.isSelectedGist = false;
          this.ui.btnFollow.hide();
        }
      },

      onGistItemSelected: function(e) {
        this.isSelectedGist = true;

        this.ui.btnFollow.show();

        $('.gist-item-container .row-fluid').removeClass('selected');
        $(e.currentTarget).parents('.row-fluid').addClass('selected');
        $('.comments-badge').hide().show(300);

        postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
        postalWrapper.publish(constants.REMOVE_IS_SELECTED, this); // in order for setting isSelectedGist boolean variable as false in other instances of GistItemView
      },

      onCommentDeleted: function(commentId) {
        var self = this;
        if (!self.isSelectedGist) return;
        if (self.model.get('comments') && self.model.get('comments') > 0) {
          self.model.set('comments', self.model.get('comments') - 1);
        } else {
          self.model.set('comments', 0);
        }
      },

      onCommentAdded: function(comment) {
        var self = this;
        if (!self.isSelectedGist) return;
        if (self.model.get('comments') && self.model.get('comments') > 0) {
          self.model.set('comments', self.model.get('comments') + 1);
        } else {
          self.model.set('comments', 1);
        }
      },

      onTagChanged: function(tags) {
        var self = this;
        if (self.isSelectedGist) {
          // find tags owned by this gist
          var tagNames = _.filter(tags, function(tag) {
            var isIn = _.where(tag.gists, {
              'gist_id': self.model.get('id')
            });
            return isIn.length;
          });

          var userTags = _.pluck(tagNames, 'tag_name');
          self.model.set('tags', userTags);
          self.render();
          self.ui.btnFollow.show();
        }
      },

      onStarChanged: function(gist) {
        var self = this;
        if (!self.isSelectedGist) return;

        self.model.set('is_starred', gist.is_starred);

        setTimeout(function() {
          if (gist.is_starred) {
            self.$el.find('.span9').prepend(
              '<i class="is-starred icon-star"></i>');
          } else {
            self.$el.find('.is-starred').remove();
          }
        }, 100);

      },

      onClose: function() {
        this.subscription.unsubscribe();
        this.subscriptionRemoveIsSelected.unsubscribe();
        this.subscriptionDeleteComment.unsubscribe();
        this.subscriptionAddComment.unsubscribe();
        this.subscriptionUserFollow.unsubscribe();
        this.subscriptionUserUnFollow.unsubscribe();
      }
    });

  return GistItemView;
});
