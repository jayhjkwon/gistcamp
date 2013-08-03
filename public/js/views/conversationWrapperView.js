define(function(require){

/*
	var socket = require('socketWrapper');
	
	// listener, whenever the server emits 'updatechat', this updates the chat body
	socket.on('updatechat', function (username, data) {
		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
	});
	
	// on load of page
	$(function(){
		// when the client clicks SEND
		$('#datasend').click( function() {
			var message = $('#data').val();
			$('#data').val('');
			// tell server to execute 'sendchat' and send along one parameter
			socket.emit('sendchat', message);
		});

		// when the client hits ENTER on their keyboard
		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#datasend').focus().click();
			}
		});
	});
*/
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

		ConversationWrapperView = Marionette.CompositeView.extend({			
			template : conversationWrapperTemplate,
			
			initialize: function(options){
				var self = this;
				console.log('ConversationWrapperView initialized');
			}

			//events: {
			//	
			//}
		})
	;

	return ConversationWrapperView;
});