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
		autoGrow        = require('autoGrow'),

		CommentsWrapperView = Marionette.CompositeView.extend({
			className: 'comments',			
			template : commentsWrapperTemplate,
			itemView : CommentItemView,
			itemViewContainer: '.comment-list',
			selectedGistItem : {},
			xhrs : [],
			xhr: {},

			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected', 'onCommentInputKeypress');
				this.spinner = new Spinner({length:7});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			events: {
				'keydown #comment-input' : 'onCommentInputKeypress'
			},

			onDomRefresh: function(){
				$('.comments-wrapper').niceScroll({cursorcolor:'#fff'});
				$('#comment-input').autoGrow();
			},

			onCommentInputKeypress : function(e){
				var self = this;
				var keyCode = e.keyCode || e.which;
		    	if (keyCode === 13 && !self.saving){
		    		self.saving = true;
		    		self.loading(true);
		    		$(e.target).attr('disabled', 'disabled');
		    		var text = $('#comment-input').val();
		    		var comment = new CommentItem({gistId: this.selectedGistItem.id, commentText: text});
		    		comment.save()
		    		.done(function(data){
		    			if (self.collection){
		    				self.collection.add(data);
		    			}else{
		    				self.collection = new CommentItemList({gistId: self.selectedGistItem.id});
		    				self.collection.add(data);
		    			}
		    			self.render();
		    		})
		    		.always(function(){
		    			self.saving = false;
		    			$(e.target).removeAttr('disabled');
		    			self.loading(false);		    			
		    		});
		    	}
			},

			onItemSelected: function(gistItem){
				var self = this;
				console.log('onItemSelected in CommentsWrapperView');
				console.dir(gistItem);				

				if (self.xhr.state && self.xhr.state() === 'pending') {
					self.xhr.abort();
				}

				self.selectedGistItem = gistItem;

				if (gistItem.comments == 0){
					if (self.collection){
						self.collection.reset();
						self.render();
					}
				}else{
					self.loading(true);
					self.collection = new CommentItemList({gistId: gistItem.id});
					self.xhr = self.collection.fetch();
					self.xhr.done(function(res){
							// self.collection.set(res);
							self.render();
						})
						.always(function(){
							self.loading(false);
							$('#comment-input').focus();
						});
				}
			},

			onClose: function(){
				var self = this;
				_.each(self.xhrs, function(xhr){
					var s = xhr.state();
					if (s === 'pending') {
						xhr.abort();	// abort ajax requests those are not completed
					}
				});
			},

			loading: function(showSpinner){
				if (showSpinner){
					var target = $('.comment-input-wrapper')[0];
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