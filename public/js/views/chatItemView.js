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
				_.bindAll(this, 'onGistItemSelected');
			},

			events : {
				'click .chat-item' : 'onGistItemSelected'
			},

			onGistItemSelected : function(e){
				$('.chat-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				
				// Application.execute(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				global.socket.emit('switchRoom', this.model.id);
				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
			},

			onClose: function(){
				
				global.socket.emit('leaveRoom', this.model.id);
				// var self = this;
				// _.each(self.xhrs, function(xhr){
				// 	var s = xhr.state();
				// 	if (s === 'pending') {
				// 		xhr.abort();	// abort ajax requests those are not completed
				// 	}
				// });
			},
		})
	;

	return ChatItemView;
});