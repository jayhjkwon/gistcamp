define(function (require) {
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		createGistItemTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = Marionette.ItemView.extend({
			template : createGistItemTemplate,
			
		});

	return CreateGistItemView;
});