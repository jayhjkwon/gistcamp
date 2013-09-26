define(function(require) {
  var
  $         = require('jquery'),
  _         = require('underscore'),
  Marionette    = require('marionette'),
  chatItemTemplate= require('hbs!templates/chatItemTemplate'),
  Application   = require('application'),
  constants     = require('constants'),   
  nicescroll    = require('nicescroll'),
  bootstrap     = require('bootstrap'),
  prettify    = require('prettify'),  
  postalWrapper   = require('postalWrapper'), 
  util            = require('util'),
  Spinner         = require('spin'),
  global          = require('global'),


  ChatItemView = Marionette.ItemView.extend({     
    template : chatItemTemplate,
    className: 'row-fluid',

    initialize: function(options){
      _.bindAll(this, 'onGistItemSelected', 'onAddClassSelected', 'onViewFileContent', 'modelChanged');
    },

    events : {
      'click .chat-item' : 'onGistItemSelected',
      'click .file-content' : 'onViewFileContent'
    },

    ui : {
      divChatItem : '.chat-item',
      btnView : '.file-content'
    },

    modelChanged: function(key, room) {
      $('#'+key).html('');
      var users = room.users;
      for (var i = 0; i < users.length; i++) {
        $('#'+ key).append('<img src="' + users[i].avatar + '" style="width:19px;height:19px;margin-top:2px;opacity:' + users[i].opacity + ';" />');  
      };
    },

    onViewFileContent: function(e){
      e.preventDefault();
      $.fancybox($('#files-wrapper'), {
        maxWidth  : 800,
        maxHeight : 600,
        fitToView : false,
        width   : '70%',
        height    : '70%',
        autoSize  : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none'
      });
    },

    onGistItemSelected : function(e){
      this.isSelectedGist = true;
      
      global.socket.emit('switchRoom', this.model.id);

      $('.chat-item-container .row-fluid').removeClass('selected');
      $(e.currentTarget).parents('.row-fluid').addClass('selected');

      postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
    },

    onAddClassSelected : function() {

      $('.chat-item-container .row-fluid').removeClass('selected');
      this.ui.divChatItem.parents('.row-fluid').addClass('selected');

      $('.file-content').hide();
      this.ui.btnView.show();
    }
  })
;

return ChatItemView;
});