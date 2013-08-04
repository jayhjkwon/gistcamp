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
		autoGrow        = require('autoGrow'),
		
		CommentItemView = Marionette.ItemView.extend({
			template: commentItemTemplate,
			className: 'comment',

			initialize: function(){				
				_.bindAll(this, 'onCommentDoubleClick');
			},
			
			events : {	
				'dblclick .comment-text' : 'onCommentDoubleClick',
				'blur .comment-edit'     : 'onCommentBlur'
			},

			onCommentDoubleClick : function(e){
				$(e.target).hide().next('.comment-edit').show().focus().autoGrow();
			},

			onCommentBlur : function(e){
				$(e.target).hide().prev('.comment-text').show();
			}
		})
	;

	return CommentItemView;
});