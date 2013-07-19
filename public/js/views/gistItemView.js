define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		gistItemTemplate= require('hbs!templates/gistItemTemplate'),
		
		GistItemView 	= Marionette.ItemView.extend({
			template: gistItemTemplate,
			className: 'row-fluid'
		});

		return GistItemView;
});