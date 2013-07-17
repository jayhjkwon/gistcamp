define(function(require){
	var
		$ = require('jquery'),
		Marionette = require('marionette'),
		gistListTemplate = require('hbs!templates/gistListTemplate'),
		Application = require('application'),
		constants = require('constants'),		
		nicescroll = require('nicescroll'),

		GistListView = Marionette.Layout.extend({
			initialize: function(menu){
				console.log('GistListView initialized');

				// remove previous registered handlers then add handler
				Application.vent.off(constants.MENU_SELECTED, this.onMenuChanged)
								.on(constants.MENU_SELECTED, this.onMenuChanged);

			},

			className: 'main-content',
			
			template : gistListTemplate,

			onMenuChanged : function(menu){
				console.log('test');
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