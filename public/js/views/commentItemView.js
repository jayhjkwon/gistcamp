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
		global          = require('global'),
		Spinner         = require('spin'),
		CommentItem     = require('models/commentItem'),
		
		CommentItemView = Marionette.ItemView.extend({
			template: commentItemTemplate,
			className: 'comment',

			initialize: function(options){		
				var self = this;		
				this.gistItem = options.gistItem;
				_.bindAll(this, 'onCommentDoubleClick', 'onCommentEditKeypress');
				this.spinner = new Spinner({length:5,lines:9,width:4,radius:4});
			},
			
			events : {	
				'dblclick .comment-text' : 'onCommentDoubleClick',
				'blur .comment-edit'     : 'onCommentBlur',
				'keydown .comment-edit'  : 'onCommentEditKeypress'
			},

			onCommentDoubleClick : function(e){
				if (this.model.get('user').id === global.user.id){
					$(e.target).hide().next('.comment-edit').show().focus().autoGrow();
				}
			},

			onCommentBlur : function(e){
				$(e.target).hide().prev('.comment-text').show();
			},

			onCommentEditKeypress : function(e){
				var self = this;
				var keyCode = e.keyCode || e.which;
		    	if (keyCode === 13 && !self.saving){
		    		self.saving = true;
		    		self.loading(true, e.target);
		    		$(e.target).attr('disabled', 'disabled');
		    		var text = $(e.target).val();
		    		var comment = new CommentItem({gistId: self.gistItem.id, commentText: text, id: self.model.get('id')});
		    		comment.save()
		    		.done(function(data){
		    			self.model.set(data);
		    			self.render();
		    		})
		    		.always(function(){
		    			self.saving = false;
		    			$(e.target).removeAttr('disabled');
		    			self.loading(false);	
		    			$('.comment-edit').trigger('blur');
		    		});
		    	}
			},

			loading: function(showSpinner, el){
				if (showSpinner){
					var target = $(el).parents()[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
				}
			},

			onClose: function(){
			}
		})
	;

	return CommentItemView;
});