define(function(require){
	var 
		Marionette = require('marionette'),
		App = require('application'),
		
		Controller = Marionette.Controller.extend({
			showHome : function(){
				App.contentRegion.close();
			},
			showUser : function(){
				require(['views/userView'], function(UserView){
					var userView = new UserView;
					userView.getUser();		
					App.vent.on('user:delete', function(user){
						console.log('user has been deleted');
					});
					App.contentRegion.show(userView);
				});
			},
			showTest : function(){
				require(['views/testView'], function(TestView){
					App.contentRegion.show(new TestView);
				});
			}
		})
	;

	return Controller;
});