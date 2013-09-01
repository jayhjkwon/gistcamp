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
		global          = require('global'),


		CommentsWrapperView = Marionette.CompositeView.extend({
			className: 'comments',			
			template : commentsWrapperTemplate,
			itemView : CommentItemView,
			itemViewContainer: '.comment-list',
			selectedGistItem : {},
			// xhrs : [],
			xhr: {},

			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected', 'onCommentInputKeypress', 'onCommentDeleted');
				this.spinner = new Spinner({length:5,lines:9,width:4,radius:4});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
				this.subscriptionDeleteComment = postalWrapper.subscribe(constants.COMMENT_DELETE, this.onCommentDeleted);
			},

			events: {
				'keydown #comment-input' : 'onCommentInputKeypress'
			},

			itemViewOptions : function(){
				return { gistItem: this.selectedGistItem };	// gistItem will be passed to the itemView
			},

			onDomRefresh: function(){
				$('.loggedin-user-avatar').attr('src', global.user.avatar);				
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

		    			postalWrapper.publish(constants.COMMENT_ADD, data);

		    			// send alarm
		    			if (self.selectedGistItem.user.id !== global.user.id){
			    			var msg = global.user.name + ' just commented on your gist(' + self.selectedGistItem.description + ') ';
			    			msg = msg + '</br>';
			    			msg = text.length > 50 ? msg + '"' + text.substring(0,50) + '.."' : msg + '"' + text + '"';
			    			global.socket.emit('sendalarm', self.selectedGistItem.user.id, msg);
			    		}
		    		})
		    		.always(function(){
		    			self.saving = false;
		    			$(e.target).removeAttr('disabled');
		    			self.loading(false);	
		    			$('#comment-input').focus();
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

			onCommentDeleted: function(commentId){
				var self = this;
				self.collection.remove(self.collection.get(commentId));
				self.render();
			},

			onClose: function(){
				var self = this;
				self.subscription.unsubscribe();
				self.subscriptionDeleteComment.unsubscribe();
				/*_.each(self.xhrs, function(xhr){
					var s = xhr.state();
					if (s === 'pending') {
						xhr.abort();	// abort ajax requests those are not completed
					}
				});*/
			},

			loading: function(showSpinner){
				if (showSpinner){
					var target = $('.comment-input-wrapper')[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
				}
			}
		})
	;

	return CommentsWrapperView;
});