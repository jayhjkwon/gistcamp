define(function(require){
	var
		Marionette = require('marionette'),
		shellTemplate = require('hbs!templates/shellTemplate'),		
		ShellView = Marionette.Layout.extend({
			template: shellTemplate
		})
	;

	return ShellView;
});