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
		postalWrapper   = require('postalWrapper'),	
		CommentItemView = require('./commentItemView'),

		CommentsWrapperView = Marionette.CompositeView.extend({
			className: 'comments',			
			template : commentsWrapperTemplate,
			itemView : CommentItemView,
			ItemViewContainer: 'div.comment-list',

			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected');
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			onDomRefresh: function(){
				$('.comments-wrapper').niceScroll({cursorcolor: '#eee'});
			},

			onItemSelected: function(gistItem){
				console.log('onItemSelected in CommentsWrapperView');
				console.dir(gistItem);
			},

			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;

	return CommentsWrapperView;
});