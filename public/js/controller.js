define(function(require){
	var 
		Marionette = require('marionette'),
		App = require('application'),
		HomeView = require('views/homeView'),
		UserView = require('views/userView'),
		TestView = require('views/testView'),
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
				
			},
			showUser : function(){
				var userView = new UserView;
				userView.getUser();		
				App.vent.on('user:delete', function(user){
					console.log('user has been deleted');
				});
				App.contentRegion.show(userView);				
			},
			showTest : function(){
				var testView = new TestView;
				App.contentRegion.show(testView);
			}
		})
	;

	return Controller;
});