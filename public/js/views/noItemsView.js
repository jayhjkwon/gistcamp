define(function(require){
	var
		Marionette = require('marionette'),
		noItemViewTemplate = require('hbs!templates/noItemTemplate'),

		NoItemsView = Marionette.ItemView.extend({
			template: noItemViewTemplate
		})
	;

	return NoItemsView;
});