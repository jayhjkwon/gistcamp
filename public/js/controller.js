define(function(require){
	var 
		Marionette = require('marionette'),
		App = require('application'),
		UserView = require('views/userView'),
		TestView = require('views/testView');

	var
		Controller = Marionette.Controller.extend({
			showHome : function(){
				App.contentRegion.close();
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