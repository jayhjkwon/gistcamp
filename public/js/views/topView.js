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


define(function(require){
	var
		$ = require('jquery'),
		Marionette = require('marionette'),
		topTemplate = require('hbs!templates/topTemplate'),

		TopView = Marionette.ItemView.extend({
			className: 'navbar-inner',
			template: topTemplate
		})
	;

	return TopView;
});