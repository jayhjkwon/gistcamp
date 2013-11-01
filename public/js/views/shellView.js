define(function(require){
  var
    $ = require('jquery'),
    Marionette = require('marionette'),
    shellTemplate = require('hbs!templates/shellTemplate'),   
    ShellView = Marionette.Layout.extend({
      initialize: function(){
          // console.log('ShellView Initialized')
      },
      template: shellTemplate,
      regions: {
        top: '#top',
        main: '#main',
        footer: '#footer'
      },
      hideFooterRegion: function(){
        $('#main .main-content').css("bottom", "0px");
        $('#main .main-content .chat-wrapper').css("bottom", "0px");
        $('#footer').hide();
      },
      showFooterRegion: function(){
        $('#main .main-content').css("bottom", "70px");
        $('#footer').show();
        
      }
    })
  ;

  // note that returning instance of ShellView so that only one instance will be created 
  // in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
  return new ShellView; 
});