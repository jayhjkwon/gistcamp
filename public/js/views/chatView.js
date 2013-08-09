define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		chatTemplate    = require('hbs!templates/chatTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),		

		ChatView = Marionette.Layout.extend({
			currentSelectedMenu : '',

			initialize: function(menu){
				var self = this;
				console.log('ChatView initialized');	
			},

			className: 'main-content',
			
			template : chatTemplate,

			regions : {
				chatList    : '#chat-list',
				filesWrapper    : '#files-wrapper',
				chatWrapper : '#chat-wrapper'
			},

			events : {
				
			},

			onClose: function(){
			}
		})
	;

	return ChatView;
});