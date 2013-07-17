define(function(require){
	var
		$ = require('jquery'),
		_ = require('underscore'),
		Marionette = require('marionette'),
		gistListTemplate = require('hbs!templates/gistListTemplate'),
		Application = require('application'),
		constants = require('constants'),		
		nicescroll = require('nicescroll'),

		GistListView = Marionette.Layout.extend({
			currentSelectedMenu : '',

			initialize: function(menu){
				var self = this;
				console.log('GistListView initialized');

				if (this.options.currentSelectedMenu)
					self.currentSelectedMenu = this.options.currentSelectedMenu;
				console.log('currentSelectedMenu= ' + self.currentSelectedMenu);
				if (this.options.tag)
					console.log('tag= ' + this.options.tag);				
			},

			className: 'main-content',
			
			template : gistListTemplate,

			events : {
				'click .gist-item' : 'onGistItemSelected'
			},

			onGistItemSelected : function(e){
				$('.gist-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				$('.comments-badge').hide().show(500);
			},

			onDomRefresh: function(){
				$('.gist-list').niceScroll({cursorcolor: '#eee'});
				$('.center').niceScroll({cursorcolor: '#eee'});
				$('.comments-wrapper').niceScroll({cursorcolor: '#eee'});
			}
		})
	;

	return GistListView;
});