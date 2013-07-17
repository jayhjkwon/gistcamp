define(function(require){
	var 
		Marionette = require('marionette'),
		App = require('application'),
		gistListView = require('views/gistListView'),
		shellView = require('views/shellView')
	;

	var
		Controller = Marionette.Controller.extend({
			home : function(){
				shellView.main.show(new gistListView);
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