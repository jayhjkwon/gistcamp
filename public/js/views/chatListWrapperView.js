define(function(require){

/*
	var socket = require('socketWrapper');

	socket.on('updaterooms', function(rooms, current_room) {
		$('#rooms').empty();


			$.each(rooms, function(key, value) {
			if(value == current_room){
				$('#rooms').append('<div>' + value + '</div>');
			}
			else {
				$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
			}
			});
	});

	function switchRoom(room){
		socket.emit('switchRoom', room);
	}
*/
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		chatListWrapperTemplate = require('hbs!templates/chatListWrapperTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),	
		postalWrapper   = require('postalWrapper'),	
		util            = require('util'),
		Spinner         = require('spin'),

		ChatListWrapperView = Marionette.CompositeView.extend({			
			template : chatListWrapperTemplate,
			
			initialize: function(options){
				var self = this;
				console.log('ChatListWrapperTemplate initialized');
			}

			//events: {
			//	
			//}
		})
	;

	return ChatListWrapperView;
});