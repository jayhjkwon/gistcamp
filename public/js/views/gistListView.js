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
				gistItemList : '#gist-item-list'
			},

			events : {
				'click .pivot-headers a' : 'onFileNameClicked'/*,
				'scroll .gist-list' : 'onScroll'*/
			},

			onScroll : function(){
				var w = $('.gist-list');
				if(w.scrollTop() + w.height() == $('.gist-item-container').height()) {
			       alert("bottom!");
			    }
			},

			onDomRefresh: function(){
				// Application.vent.on(constants.MENU_SELECTED, this.onMenuChanged);

				$('.gist-list').niceScroll({cursorcolor: '#eee'});
				$('.center').niceScroll({cursorcolor: '#eee'});
				$('.comments-wrapper').niceScroll({cursorcolor: '#eee'});

				$('.carousel').carousel({interval: false});

				prettyPrint();

				$('.gist-list').off('scroll').on('scroll', this.onScroll);
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
				// Application.vent.off(constants.MENU_SELECTED, this.onMenuChanged);	
			}
		})
	;

	return GistListView;
});