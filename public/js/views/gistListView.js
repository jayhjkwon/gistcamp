define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Marionette = require('marionette'),
    gistListTemplate = require('hbs!templates/gistListTemplate'),
    Application = require('application'),
    constants = require('constants'),
    nicescroll = require('nicescroll'),
    bootstrap = require('bootstrap'),
    prettify = require('prettify'),

    GistListView = Marionette.Layout.extend({
      currentSelectedMenu: '',

      initialize: function(menu) {
        var self = this;

        if (this.options.currentSelectedMenu)
          self.currentSelectedMenu = this.options.currentSelectedMenu;
      },

      className: 'main-content',

      template: gistListTemplate,

      regions: {
        friendsItemList: '#friends-item-list',
        gistItemList: '#gist-item-list',
        filesWrapper: '#files-wrapper',
        commentsWrapper: '#comments-wrapper'
      },

      events: {
        'click .pivot-headers a': 'onFileNameClicked'
      },

      onFileNameClicked: function(e) {
        e.preventDefault();
        $('.pivot-headers a').removeClass('active');
        $(e.currentTarget).addClass('active');
      },

      // check if elem is visible
      isScrolledIntoView: function(scrollElem, elem) {
        var docViewTop = $(scrollElem).scrollTop();
        var docViewBottom = docViewTop + $(scrollElem).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
      }
    });

  return GistListView;
});
