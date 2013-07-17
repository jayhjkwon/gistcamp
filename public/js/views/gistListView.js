define(function(require){
	var
		Marionette = require('marionette'),
		gistListTemplate = require('hbs!templates/gistListTemplate'),

		GistListView = Marionette.Layout.extend({
			className: 'main-content',
			template : gistListTemplate
		})
	;

	return GistListView;

});