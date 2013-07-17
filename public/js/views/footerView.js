define(function(require){
	var
		Marionette = require('marionette'),
		footerTemplate = require('hbs!templates/footerTemplate'),

		FooterView = Marionette.Layout.extend({
			className: 'command-buttons',
			template : footerTemplate
		})
	;


	// note that returning instance of FooterView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new FooterView;

});