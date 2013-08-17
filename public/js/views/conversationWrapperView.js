define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		conversationWrapperTemplate = require('hbs!templates/conversationWrapperTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),	
		postalWrapper   = require('postalWrapper'),	
		util            = require('util'),
		Spinner         = require('spin'),
		global          = require('global'),

		ConversationWrapperView = Marionette.CompositeView.extend({			
			template : conversationWrapperTemplate,
			
			initialize: function(options){
				var self = this;
				console.log('ConversationWrapperView initialized');
			},

			events: {
				'click #datasend' : 'onDataSendClicked',
				'keypress #data' : 'onDataSendKeyPress'
			},

			onDataSendClicked : function(){
				var message = $('#data').val();

				if (message)
				{
					$('#data').val('');
					// tell server to execute 'sendchat' and send along one parameter
					global.socket.emit('sendchat', message);	
				}

				
				$('data').focus();
				
			},

			onDataSendKeyPress : function(e){
				if(e.which == 13) {
					$(this).blur();
					$('#datasend').click();
				}
			}
		})
	;

	return ConversationWrapperView;
});