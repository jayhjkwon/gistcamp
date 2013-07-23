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