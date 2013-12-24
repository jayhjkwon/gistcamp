define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Marionette = require('marionette'),
    topTemplate = require('hbs!templates/topTemplate'),
    Application = require('application'),
    constants = require('constants'),
    global = require('global'),
    TagItemList = require('models/tagItemList'),
    postalWrapper = require('postalWrapper'),
    tipsy = require('tipsy'),

    TopView = Marionette.ItemView.extend({
      className: 'navbar-inner',
      template: topTemplate,

      initialize: function() {
        var self = this;
        _.bindAll(this, 'onCollectionChanged', 'onSyncClick', 'sync',
          'activateMenu', 'showTagInfo', 'onTagChanged');

        Application.commands.setHandler(constants.MENU_SELECTED, function(
          menu) {
          self.activateMenu(menu);
        });

        this.showTagInfo();
        this.subscription = postalWrapper.subscribe(constants.TAG_CHANGED,
          this.onTagChanged);

        if (this.collection) {
          this.listenTo(this.collection, 'reset', this.onCollectionChanged);
        }
      },

      events: {
        'click #btn-refresh': 'onRefreshClick',
        'click .sync a': 'onSyncClick'
      },

      onRender: function() {
        var self = this;
        this.showUserInfo();
        $('.sync a').tipsy({
          fade: true
        });
      },

      onSyncClick: function(e) {
        e.preventDefault();
        this.sync();
      },

      sync: function(e) {
        this.syncInProgress = true;
        this.$el.find('i.icon-refresh').addClass('icon-spin');
        this.syncInProgress = false;
      },

      showTagInfo: function() {
        this.collection = new TagItemList();
        this.collection.fetch();
      },

      onTagChanged: function(tags) {
        this.collection.reset(tags);
      },

      onCollectionChanged: function(tags) {
        var html = '';

        _.each(tags.models, function(tag) {
          html = html + '<li><a href="#tagged/' + tag.get('_id') + '/' +
            tag.get('tag_url') + '"><span class="pull-left">' + tag.get(
              'tag_name') +
            '</span><span class="badge badge-inverse pull-right">' + tag.get(
              'gists').length + '</span></a></li>';
        });

        document.querySelector('#top .tags').innerHTML = html;
      },

      showUserInfo: function() {
        $('#loggedin-user-name').text(global.user.name);
        $('.loggedin-user-avatar').attr('src', global.user.avatar);
        $('.loggedin-user-url').attr('href', global.user.url);
      },

      onRefreshClick: function(e) {
        window.location.reload(true);
      },

      activateMenu: function(menu) {
        this.removeActiveClass();
        $('header .nav li a[href="#' + menu + '"]').parent().addClass(
          'active');
      },

      removeActiveClass: function() {
        $('header .nav li').removeClass('active');
      },

      onClose: function() {
        this.subscription.unsubscribe();
        if ($('.tipsy')) $('.tipsy').remove();
      }

    });

  // note that returning instance of TopView so that only one instance will be created 
  // in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
  return new TopView;
});
