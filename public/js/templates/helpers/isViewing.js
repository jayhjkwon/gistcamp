define(function(require){
	var 
		Handlebars = require('handlebars'),
		_          = require('underscore')
	;

	Handlebars.registerHelper('isViewing', function(user, options){
		return '<button class="btn btn-danger file-content" style="display:none">View</button>';
	});
});