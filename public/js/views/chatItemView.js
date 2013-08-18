define(function(require) {
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		chatItemTemplate= require('hbs!templates/chatItemTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),	
		postalWrapper   = require('postalWrapper'),	
		util            = require('util'),
		Spinner         = require('spin'),
		global          = require('global'),


		ChatItemView = Marionette.ItemView.extend({			
			template : chatItemTemplate,
			className: 'row-fluid',

			initialize: function(options){
				_.bindAll(this, 'onGistItemSelected', 'onAddClassSelected');
			},

			events : {
				'click .chat-item' : 'onGistItemSelected'
			},

			ui : {
				divChatItem : '.chat-item'
			},

			onGistItemSelected : function(e){

				$('.chat-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				
				// Application.execute(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				global.socket.emit('switchRoom', this.model.id);
			},

			onAddClassSelected : function() {

				$('.chat-item').removeClass('selected');
				this.ui.divChatItem.addClass('selected');
			}
		})
	;

	return ChatItemView;
});