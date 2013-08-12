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

		FooterView = Marionette.ItemView.extend({
			className: 'command-buttons',
			template : footerTemplate,
			selectedGistItem : {},
			initialize: function(){
				_.bindAll(this, 'setTagPopOverUI', 'onItemSelected', 'createTag', 'loading', 'onBtnCommentClick', 'onRoomCreated');

				this.tags = new TagItemList();

				this.listenTo(this.tags, 'all', this.onTagCollectionChange);
				this.spinner = new Spinner({length:5,lines:9,width:4,radius:4});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
				this.router = new Router();
			},

			events: {
				'click .btn-comments' : 'onBtnCommentClick',
				'click .btn-reload'   : 'onReloadClick',
				'click .btn-chats'    : 'onRoomCreated',
				'keydown #new-tag'    : 'createTag'
			},

			ui : {
				btnTag : '.tag'
			},

			onRender: function(){
				this.setTagPopOverUI();				
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

			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;


	// note that returning instance of FooterView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new FooterView;

});