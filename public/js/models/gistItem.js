define(function(require){
	var
		Backbone		= require('backbone'),		
		GistItem 		= Backbone.Model.extend({	

			initialize: function(options){
				this.id = options ? options.id || null : null;
			},

			url : function(){
				if(this.id)
					return '/api/gist/newgist/' + this.id;
				return 'api/gist/newgist';
			}	
		})
	;

	return GistItem;
});