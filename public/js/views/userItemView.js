define(function(require){
	var
		Marionette = require('marionette'),
		userItemTemplate = require('hbs!templates/userItemTemplate'),

		UserItemView = Marionette.ItemView.extend({
			tagName : 'li',
			template: userItemTemplate
		})
	;

	return UserItemView;
});