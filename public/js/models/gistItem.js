define(function(require){
	var
		Backbone		= require('backbone'),		
		GistItem 		= Backbone.Model.extend({	

			initialize: function(props){
				// console.log('gistItem initialized');
				// this.gistId = props ? props.gistId || '' : '';
				// this.id = props ? props.id || '' : '';
			},

			url : function(){
				return '/api/gist/newgist';
			}	
		})
	;

	return GistItem;
});