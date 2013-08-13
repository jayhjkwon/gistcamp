define(function (require) {
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		createGistItemTemplate = require('hbs!templates/createGistItemTemplate'),
		CreateGistItemView = Marionette.ItemView.extend({
			template : createGistItemTemplate,
			tagName : 'div',
			className : 'item'

		});

	return CreateGistItemView;
});