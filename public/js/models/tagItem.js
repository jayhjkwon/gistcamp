define(function(require){
	var
		Backbone = require('backbone'),		
		
		TagItem  = Backbone.Model.extend({
			initialize: function(options){
			},

			url : function(){
				return "/api/gist/tags";
			}			
		})
	;

	return TagItem;
});