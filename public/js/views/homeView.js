define(function(require){
	var
		Marionette = require('marionette'),
		homeTemplate = require('hbs!templates/homeTemplate'),

		HomeView = Marionette.Layout.extend({
			className: 'main-content',
			template : homeTemplate
		})
	;

	return HomeView;

});