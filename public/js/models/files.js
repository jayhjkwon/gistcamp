define(function(require){
	var
		Backbone	= require('backbone'),
		File 	    = require('./file'),

		Files	    = Backbone.Collection.extend({
			model: File,
			initialize: function(props){
				console.log('Files Collection initialized');
			},
			url : function(){
				return "/api/gist/rawfiles";
			}
		})
	;

	return Files;
});