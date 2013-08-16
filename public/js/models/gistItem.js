define(function(require){
	var
		Backbone		= require('backbone'),		
		GistItem 		= Backbone.Model.extend({		
			url : function(){
				return '/api/gist/newgist';
			}	
		})
	;

	return GistItem;
});