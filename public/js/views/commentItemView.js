define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		commentItemTemplate= require('hbs!templates/commentItemTemplate'),
		Application 	= require('application'),
		constants       = require('constants'),
		postalWrapper   = require('postalWrapper'),
		
		CommentItemView = Marionette.ItemView.extend({
			template: commentItemTemplate,
			className: 'comment',

			initialize: function(){				
			},
			
			events : {				
			}
		})
	;

	return CommentItemView;
});