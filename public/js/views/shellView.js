define(function(require) {
  var
  $ = require('jquery'),
    Marionette = require('marionette'),
    shellTemplate = require('hbs!templates/shellTemplate'),
    postalWrapper = require('postalWrapper'),
    constants = require('constants'),

    ShellView = Marionette.Layout.extend({
      template: shellTemplate,

      initialize: function() {
        // console.log('ShellView Initialized')
      },

      regions: {
        top: '#top',
        main: '#main',
        footer: '#footer'
      },

      hideFooterRegion: function() {
        $('#main .main-content').css("bottom", "0px");
        $('#main .main-content .chat-wrapper').css("bottom", "0px");
        $('#footer').hide();
      },

      showFooterRegion: function() {
        $('#main .main-content').css("bottom", "70px");
        $('#footer').show();
      },

      showWatchRegion: function() {
        $('.gist-list').css({
          'left': '204px',
          'width': '220px'
        });
        $('.files-wrapper').css({
          'left': '427px'
        });
      },

      hideCommentRegion: function() {
        postalWrapper.publish(constants.HIDE_COMMENT_REGION);
      }
    });

  // note that returning instance of ShellView so that only one instance will be created 
  // in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
  return new ShellView;
});
