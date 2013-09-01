define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		gistItemTemplate= require('hbs!templates/gistItemTemplate'),
		Application 	= require('application'),
		constants       = require('constants'),
		postalWrapper   = require('postalWrapper'),
		User            = require('models/user'),
		
		GistItemView 	= Marionette.ItemView.extend({
			template: gistItemTemplate,
			className: 'row-fluid',
			isSelectedGist : false,

			initialize: function(){
				var self = this;
				_.bindAll(this, 'onGistItemSelected', 'onTagChanged', 'onClose', 'setIsSelectedGistFalse', 'onFollowUserClicked', 'onCommentDeleted', 'onCommentAdded');
				this.subscription = postalWrapper.subscribe(constants.TAG_CHANGED, this.onTagChanged);
				this.subscriptionRemoveIsSelected = postalWrapper.subscribe(constants.REMOVE_IS_SELECTED, this.setIsSelectedGistFalse);
				this.subscriptionDeleteComment = postalWrapper.subscribe(constants.COMMENT_DELETE, this.onCommentDeleted);
				this.subscriptionAddComment = postalWrapper.subscribe(constants.COMMENT_ADD, this.onCommentAdded);
			},
			
			events : {
				'click .gist-item'   : 'onGistItemSelected',
				'click .follow-user' : 'onFollowUserClicked'
			},

			ui : {
				btnFollow : '.follow-user'
			},

			onFollowUserClicked: function(e){
				var self = this;
				var u = this.model.toJSON().user;
				this.ui.btnFollow.prop('disabled', true);
				if(this.ui.btnFollow.text() === 'Follow'){
					var user = new User({mode: constants.USER_FOLLOW, id:u.id, loginId: u.login});
					user.save().done(function(){
						self.ui.btnFollow.prop('disabled', false);
						self.ui.btnFollow.text('Unfollow'); 
						u.is_following_this_user = true;
					});					
				}else{
					var user = new User({mode: constants.USER_UNFOLLOW, id:u.id, loginId: u.login});
					user.destroy({
						success: function(){ 
							self.ui.btnFollow.prop('disabled', false);
							self.ui.btnFollow.text('Follow'); 
							u.is_following_this_user = false;
						}
					});
				}
			},

			setIsSelectedGistFalse: function(context){ 
				if (context !== this) {
					this.isSelectedGist = false; 
					this.ui.btnFollow.hide();
				}
			},
			
			onGistItemSelected : function(e){
				this.isSelectedGist = true;

				this.ui.btnFollow.show();

				/*$('.gist-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				$('.comments-badge').hide().show(300);*/

				$('.gist-item-container .row-fluid').removeClass('selected');
				$(e.currentTarget).parents('.row-fluid').addClass('selected');
				$('.comments-badge').hide().show(300);

				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());				
				postalWrapper.publish(constants.REMOVE_IS_SELECTED, this);	// in order for setting isSelectedGist boolean variable as false in other instances of GistItemView
			},

			onCommentDeleted: function(commentId){
				var self = this;
				if (!self.isSelectedGist) return;
				if (self.model.get('comments') && self.model.get('comments') > 0){
					self.model.set('comments', self.model.get('comments') - 1);
				}else{
					self.model.set('comments', 0);
				}	
			},

			onCommentAdded:  function(comment){
				var self = this;
				if (!self.isSelectedGist) return;
				if (self.model.get('comments') && self.model.get('comments') > 0){
					self.model.set('comments', self.model.get('comments') + 1);
				}else{
					self.model.set('comments', 1);
				}	
			},

			onTagChanged: function(tags){
				var self = this;
				if (self.isSelectedGist){
					// find tags owned by this gist
					var tagNames = _.filter(tags, function(tag){
						var isIn = _.where(tag.gists, {'gist_id':self.model.get('id')});
						return isIn.length;
					});

					var userTags = _.pluck(tagNames, 'tag_name');
					self.model.set('tags', userTags);
					self.render();
					self.ui.btnFollow.show();
				}
			},

			onClose: function(){
				this.subscription.unsubscribe();
				this.subscriptionRemoveIsSelected.unsubscribe();
				this.subscriptionDeleteComment.unsubscribe();
				this.subscriptionAddComment.unsubscribe();
			}
		});

		return GistItemView;
});