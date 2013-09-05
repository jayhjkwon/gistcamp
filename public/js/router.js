define(function(require){
	var 
		Marionette = require('marionette'),
		Controller = require('controller'),

		Router = Marionette.AppRouter.extend({
			appRoutes: {
				''            : 'friends',
				'friends'     : 'friends',
				'mygists'     : 'myGists',
				'starred'     : 'starred',
				'tagged/:id/:tag_url' : 'tagged',
				'newgist'     : 'newGist',
				'chat'        : 'chat',
				'all'         : 'all'
			},

			controller: new Controller
		})
	;

	return Router;
});