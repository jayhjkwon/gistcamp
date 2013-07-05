define(function(require){
	var
		Marionette = require('marionette'),
		testTemplate = require('hbs!templates/testTemplate'),
		User = require('models/user'),
		user = new User,

		TestView = Marionette.ItemView.extend({
			template: testTemplate,
			className : 'test'
		})
	;

	return TestView;
});