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
		CommentItemList = require('models/commentItemList'),
		CommentItem     = require('models/commentItem'),
		util            = require('util'),
		Spinner         = require('spin'),

		CommentsWrapperView = Marionette.CompositeView.extend({
			className: 'comments',			
			template : commentsWrapperTemplate,
			itemView : CommentItemView,
			itemViewContainer: '.comment-list',

			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected');
				this.spinner = new Spinner({length:7});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			onDomRefresh: function(){
				$('.comments-wrapper').niceScroll({cursorcolor: '#eee'});
			},

			onItemSelected: function(gistItem){
				var self = this;
				console.log('onItemSelected in CommentsWrapperView');
				console.dir(gistItem);				

				if (gistItem.comments == 0){
					if (self.collection){
						self.collection.reset();
						self.render();
					}
				}else{
					self.loading(true);
					self.collection = new CommentItemList({gistId: gistItem.id});
					self.collection.fetch()
						.done(function(res){
							self.collection.set(res);
							self.render();
						})
						.always(function(){
							self.loading(false);
						});
				}

			},

			loading: function(showSpinner){
				if (showSpinner){
					var target = $('.comments')[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
				}
			},

			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;

	return CommentsWrapperView;
});