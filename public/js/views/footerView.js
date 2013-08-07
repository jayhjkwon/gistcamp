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
		TagItemList     = require('models/tagItemList'),
		tagListTemplate = require('hbs!templates/tagListTemplate'),

		FooterView = Marionette.ItemView.extend({
			className: 'command-buttons',
			template : footerTemplate,
			
			initialize: function(){
				_.bindAll(this, 'setTagPopOverUI');
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			events: {
				'click .btn-comments' : 'onBtnCommentClick',
				'click .btn-reload'   : 'onReloadClick',
				'click .tag'          : 'onTagClick',
				'mouseleave .popover' : 'hideTagInfo'
			},

			ui : {
				btnTag : '.tag'
			},

			onTagClick: function(){		
				if ($('.popover')) return;
			    this.ui.btnTag.popover('show');
			},

			hideTagInfo: function(){
				this.ui.btnTag.popover('hide');	
			},

			onRender: function(){
				this.setTagPopOverUI();				
			},

			setTagPopOverUI: function(){
				var self = this;
				var tags = new TagItemList();
				tags.fetch().done(function(result){
					if ($('div.tag-area')){
						self.$el.append('<div class="tag-area"></div>');
					}
					$('.tag-area').html(tagListTemplate({tags: result}));

					self.ui.btnTag.popover({
						html	: true,
						placement: 'top',
						title	: function(){ return '<div><i class="icon-tag"></i> Tag the gist</div>'; },
						content : function(){ return $('.tag-area').html(); }					
				    });	
				});				
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

			onItemSelected : function(gistItem){
				if (gistItem && gistItem.comments > 0){
					$('.comments-badge').text(gistItem.comments).show();
				}else{
					$('.comments-badge').text('').hide();
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