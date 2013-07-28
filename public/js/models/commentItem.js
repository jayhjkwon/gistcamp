define(function(require){
	var
		Backbone		= require('backbone'),		
		CommentItem		= Backbone.Model.extend({	
			initialize: function(props){
				console.log('CommentItem Model initialized');
				this.gistId = props ? props.gistId || '' : '';
			},

			url : function(){
				return '/api/gist/' + this.gistId + '/comments';
			}		
		})
	;

	return CommentItem;
});