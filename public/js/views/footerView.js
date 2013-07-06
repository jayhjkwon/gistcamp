define(function(require){
	var
		Marionette = require('marionette'),
		footerTemplate = require('hbs!templates/footerTemplate'),

		FooterView = Marionette.Layout.extend({
			className: 'command-buttons',
			template : footerTemplate
		})
	;

	return FooterView;

});