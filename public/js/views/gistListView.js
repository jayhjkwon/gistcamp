define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		gistListTemplate= require('hbs!templates/gistListTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),		

		GistListView = Marionette.Layout.extend({
			currentSelectedMenu : '',

			initialize: function(menu){
				var self = this;
				console.log('GistListView initialized');

				_.bindAll(this, 'onClose', 'onDomRefresh');

				if (this.options.currentSelectedMenu)
					self.currentSelectedMenu = this.options.currentSelectedMenu;
					console.log('currentSelectedMenu= ' + self.currentSelectedMenu);
				if (this.options.tag)
					console.log('tag= ' + this.options.tag);	
			},

			className: 'main-content',
			
			template : gistListTemplate,

			regions : {
				gistItemList    : '#gist-item-list',
				filesWrapper    : '#files-wrapper',
				commentsWrapper : '#comments-wrapper'
			},

			events : {
				'click .pivot-headers a' : 'onFileNameClicked'
			},

			onDomRefresh: function(){
				// if ( !$('#comment-input').val())
				// 	$('.btn-comments').trigger('click');
			},

			onFileNameClicked : function(e){
				e.preventDefault();
		    	$('.pivot-headers a').removeClass('active');
		    	$(e.currentTarget).addClass('active');
			},

			onMenuChanged: function(){
				console.log('onMenuChanged');
			},

			onClose: function(){
			}
		})
	;

	return GistListView;
});