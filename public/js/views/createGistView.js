define(function(require){
	var 
		Marionette = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		//AceEditor = require('aceeditor'),

		CreateGistView = Marionette.ItemView.extend({
			template: createGistTemplate
		});

	return CreateGistView;

});
