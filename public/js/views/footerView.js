define(function(require){	
	var
		$               = require('jquery'),
		_               = require('underscore'),
		Marionette      = require('marionette'),
		footerTemplate  = require('hbs!templates/footerTemplate'),
		postalWrapper   = require('postalWrapper'),
		constants 		= require('constants'),		
		store           = require('store'),
		bootstrap       = require('bootstrap'),
		TagItem         = require('models/tagItem'),
		TagItemList     = require('models/tagItemList'),
		tagListTemplate = require('hbs!templates/tagListTemplate'),
		global          = require('global'),
		Router          = require('router'),
		Spinner         = require('spin'),
		service         = require('service'),

		FooterView = Marionette.ItemView.extend({
			className: 'command-buttons',
			template : footerTemplate,
			selectedGistItem : {},

			initialize: function(){
				_.bindAll(this, 'shareGg', 'shareFB', 'shareTW', 'shareFB', 'setTagPopOverUI', 'onItemSelected', 'star', 'createTag', 'loading', 'onBtnCommentClick', 'onRoomCreated', 'tagOnGist');

				this.tags = new TagItemList();

				this.listenTo(this.tags, 'all', this.onTagCollectionChange);
				this.spinner = new Spinner({length:5,lines:9,width:4,radius:4});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
				this.router = new Router();
			},

			events: {
				'click .btn-comments'    : 'onBtnCommentClick',
				'click .btn-reload'      : 'onReloadClick',
				'click .btn-chats'       : 'onRoomCreated',
				'keydown #new-tag'       : 'createTag',
				'click .add-tag ul li a' : 'tagOnGist',
				'click .btn-star'        : 'star',
				'click .btn-fb'          : 'shareFB',
				'click .btn-tw'          : 'shareTW',
				'click .btn-gp'          : 'shareGg',
				'blur .popover'          : 'hidePopover'
			},

			ui : {
				btnTag : '.tag'
			},

			onRender: function(){
				this.setTagPopOverUI();				
			},

			star: function(e){
				service.setStar(this.selectedGistItem.id).done(function(data){
					$('.starred-success').removeClass('starred-success-hide starred-success-show').addClass('starred-success-show');
					setTimeout(function(){
						$('.starred-success').removeClass('starred-success-hide starred-success-show').addClass('starred-success-hide');
					}, 2000);
				});
			},

			hidePopover: function(){
				$('.popover').hide();
			},

			createTag: function(e){
				var self = this;
				var keyCode = e.keyCode || e.which;
		    	if (keyCode === 13 && !self.saving){
		    		self.saving = true;
		    		self.loading(true, e.target);
		    		
		    		var text = $(e.target).val();
		    		var tag = new TagItem({gistId: self.selectedGistItem.id, tagName:text});
		    		tag.save()
		    		.done(function(data){
		    			self.tags.reset(data);	    						    			
		    			self.ui.btnTag.popover('show');
		    			$(e.target).val('');
		    			postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());
		    		})
		    		.always(function(){
		    			self.saving = false;
		    			self.loading(false);
		    		});
		    	}
			},

			tagOnGist: function(e){
				e.preventDefault();
				var self = this;
				
				var tagId = $(e.target).data('tag-id');
				var tagName = $(e.target).data('tag-name');
				var gistId = this.selectedGistItem.id;

				service.editTagGist(tagId, gistId).done(function(data){
					self.tags.reset(data);
					postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());
					$(e.target).find('span.tag-saved-msg').remove();
					$(e.target).append('<span class="pull-right tag-saved-msg">Saved</span>');
					$('.tag-saved-msg').fadeOut(4000);
				});
			},

			onTagCollectionChange: function(tags){
				console.log('onTagCollectionChange event occured');
				$('.tag-area').html(tagListTemplate({tags: this.tags.toJSON()}));

			},

			setTagPopOverUI: function(){
				if ($('div.tag-area')){
					this.$el.append('<div class="tag-area"></div>');
				}

				this.ui.btnTag.popover({
					html	: true,
					placement: 'top',
					title	: function(){ return '<div><i class="icon-tag"></i> Tag the gist</div>'; },
					content : function(){ return $('.tag-area').html(); }					
			    });

				this.tags.fetch();	
			},

			onBtnCommentClick: function(e){
				var showComments = true;

				e.preventDefault();
			  	if($('.comments-wrapper').css('right') == '-300px'){
			  		$('.files-wrapper').css('right', '300px');
			  		$('.comments-wrapper').css('right','0px');	  
			  		setTimeout(function(){
				  		$('#comment-input').focus();
				  	},300);		
				  	showComments = true;
			  	}else{
			  		$('.files-wrapper').css('right', '0px');
			  		$('.comments-wrapper').css('right','-300px');
			  		showComments = false;
			  	}

			  	setTimeout(function(){
			  		$('.files-wrapper').getNiceScroll().resize();	
			  	},300);

			  	store.set(constants.SHOW_COMMENTS, showComments);
			},

			onReloadClick: function(e){
				postalWrapper.publish(constants.GIST_ITEM_RELOAD);
			},
			
			onRoomCreated : function(e){
				var self = this;
				global.socket.emit('addroom', self.selectedGistItem.id);
				self.router.navigate('chat', {trigger: true});
				
				postalWrapper.publish(constants.CHAT_CREATE_ROOM, self.selectedGistItem);
			},

			onItemSelected : function(gistItem){
				this.selectedGistItem = gistItem;
				if (gistItem && gistItem.comments > 0){
					$('.comments-badge').text(gistItem.comments).show();
				}else{
					$('.comments-badge').text('').hide();
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

			shareFB : function(){
				var gistUrl = this.selectedGistItem.html_url;
				var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(gistUrl);
				var title = 'GistCamp';
				this.popupWindow(url, title, '626', '436');
			},

			shareTW : function(){
				var gistUrl = this.selectedGistItem.html_url;
				var url = 'https://twitter.com/intent/tweet?via=gistcamp&url=' + encodeURIComponent(gistUrl);
				var title = 'GistCamp';
				this.popupWindow(url, title, '473', '258');	
			},

			shareGg : function(){
				var gistUrl = this.selectedGistItem.html_url;
				var url = 'https://plus.google.com/share?url=' + encodeURIComponent(gistUrl);
				var title = 'GistCamp';
				this.popupWindow(url, title, '473', '216');	
			},

			popupWindow: function(url, title, w, h){
				var left, top, newWindow, dualScreenLeft, dualScreenTop;

		    	dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		    	dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
			    left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
			    top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
			    newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

			    if (window.focus) {
			        newWindow.focus();
			    }
			}, 

			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;


	// note that returning instance of FooterView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new FooterView;

});