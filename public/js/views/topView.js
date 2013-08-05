define(function(require){
	var
		$           = require('jquery'),
		_           = require('underscore'),
		Marionette  = require('marionette'),
		topTemplate = require('hbs!templates/topTemplate'),
		Application = require('application'),
		constants   = require('constants'),
		global      = require('global'),

		TopView = Marionette.ItemView.extend({
			className: 'navbar-inner',
			template: topTemplate,

			initialize: function(){
				var self = this;
				_.bindAll(this, 'activateMenu');

				Application.commands.setHandler(constants.MENU_SELECTED, function(menu){
					self.activateMenu(menu);
				});				
			},

			events: {
				'click #btn-refresh' : 'onRefreshClick'
			},

			onDomRefresh: function(){
			},

			setUserInfo: function(){
				$('#loggedin-user-name').text(global.user.name);
				$('.loggedin-user-avatar').attr('src', global.user.avatar);
			},

			onRefreshClick: function(e){
				window.location.reload(true);
			},			

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