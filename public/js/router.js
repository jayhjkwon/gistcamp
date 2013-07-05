define(function(require){
	var 
		Marionette = require('marionette'),
		Controller = require('controller'),

		Router = Marionette.AppRouter.extend({
			appRoutes: {
				''     : 'showHome',
				'user' : 'showUser',
				'test' : 'showTest'
			},

			controller: new Controller
		})
	;

	return Router;
});