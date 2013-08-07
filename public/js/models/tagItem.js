define(function(require){
	var
		Backbone = require('backbone'),		
		
		TagItem  = Backbone.Model.extend({
			url : function(){
				return "/api/gist/tag";
			}			
		})
	;

	return TagItem;
});