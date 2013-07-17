define(function(require){
	var 
		Marionette = require('marionette'),
		Controller = require('controller'),

		Router = Marionette.AppRouter.extend({
			appRoutes: {
				''            : 'home',
				'following'   : 'following',
				'mygists'     : 'myGists',
				'starred'     : 'starred',
				'forked'      : 'forked',
				'tagged/:tag' : 'tagged',
				'newgist'     : 'newGist'
			},

			controller: new Controller
		})
	;

	return Router;
});