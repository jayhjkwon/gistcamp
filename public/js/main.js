require(['./require-config'], function(config){
	require(['jquery', 'backbone', 'views/topView', 'controller', 'router', 'handlebars', 'application'], 
		function($, Backbone, TopView, Controller, Router, Handlebars, App){
		$(function(){
			App.addRegions({
				topRegion  : '#top',
				contentRegion : '#content'
			});

			App.addInitializer(function(options){
				var topView = new TopView;	
				App.topRegion.show(topView);			
			});

			App.contentRegion.on('show', function(view){
				view.$el.css({
					display    : 'none',
		            marginLeft : 20,
		            marginRight: -20,
		            opacity    : 0});
				view.$el.css({display: 'block'}).animate({
		            marginLeft : 0,
		            marginRight: 0,
		            opacity    : 1}, 500, 'swing');
			});

			App.on('initialize:after', function(options){
				var router = new Router;
				Backbone.history.start({pushState: false});
			});

			App.start();
		});
	});
});

