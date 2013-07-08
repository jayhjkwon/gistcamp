define(function(require){
	var 
		Marionette = require('marionette'),
		App = require('application'),
		HomeView = require('views/homeView'),
		shellView = require('views/shellView'),
		HomeView = require('views/homeView')
	;

	var
		Controller = Marionette.Controller.extend({
			home : function(){
				shellView.main.show(new HomeView);
			},
			following : function(){
				shellView.main.close();
			},
			myGists : function(){
				shellView.main.close();
			},
			starred : function(){
				
			},
			forked : function(){
				
			},
			tagged : function(){
				
			},
			newGist : function(){
				
			}
		})
	;

	return Controller;
});