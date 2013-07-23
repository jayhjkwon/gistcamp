define(function(require){
	var
		$ = require('jquery'),
		_ = require('underscore'),
		Marionette = require('marionette'),
		topTemplate = require('hbs!templates/topTemplate'),
		Application = require('application'),
		constants = require('constants'),

		TopView = Marionette.ItemView.extend({
			initialize: function(){
				var self = this;
				_.bindAll(this, 'activateMenu');

				Application.vent.on(constants.MENU_SELECTED, function(menu){
					self.activateMenu(menu);
				});
			},

			className: 'navbar-inner',

			template: topTemplate,

			activateMenu: function(menu){
				this.removeActiveClass();						
				$('.nav li a[href="#' + menu + '"]').parent().addClass('active');
			},

			removeActiveClass: function(){
				$('.nav li').removeClass('active');
			}

		})
	;

	// note that returning instance of TopView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new TopView;		
});




/*define(function(require){
	var
		$ = require('jquery'),
		Marionette = require('marionette'),
		topTemplate = require('hbs!templates/topTemplate'),
		App = require('application'),
		Router = require('router'),

		TopView = Marionette.ItemView.extend({
			template: topTemplate,
			initialize: function(){
				this.router = new Router;
			},
			events  : {
				'click #show-user' : 'showUser', 
				'click #show-test' : 'showTest',
				'click #close-views': 'closeViews'
			},

			showUser : function(){
				this.router.navigate('user', {trigger: true, replace: true});
			},
			showTest : function(){
				this.router.navigate('test', {trigger: true, replace: true});
			},
			closeViews : function(){
				this.router.navigate('', {trigger: true});	
			}
		})
	;

	return TopView;
});*/


