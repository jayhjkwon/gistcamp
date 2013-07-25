define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		commentsWrapperTemplate= require('hbs!templates/commentsWrapperTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),		

		CommentsWrapperView = Marionette.Layout.extend({
			className: 'comments',			
			template : commentsWrapperTemplate,
			onDomRefresh: function(){
				$('.comments-wrapper').niceScroll({cursorcolor: '#eee'});
			},
		})
	;

	return CommentsWrapperView;
});