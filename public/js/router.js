define(function(require) {
  var
  Marionette = require('marionette'),
    Controller = require('controller'),

    Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'friendsGists',
        'friends(/)': 'friends',
        'mygists(/)': 'myGists',
        'starred(/)': 'starred',
        'tagged/:id/:tag_url': 'tagged',
        'newgist(/)': 'newGist',
        'chat(/)': 'chat',
        'all(/)': 'all',
        'shared(/)': 'shared',
        'friends/list(/)': 'friendsList',
        'friends/gists(/)': 'friendsGists'
      },

      controller: new Controller
    });

  return Router;
});
