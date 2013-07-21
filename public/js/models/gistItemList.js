define(function(require){
	var
		Backbone		= require('backbone'),
		constants       = require('constants'),
		GistItem 		= require('./gistItem'),
		GistItemList	= Backbone.Collection.extend({
			model: GistItem,
			initialize: function(props){
				console.log('GistItemList model initialized');
				this.gistDataMode = props ? props.gistDataMode || '' : '';
			},
			url : function(){
				var url = '';

				switch (this.gistDataMode){
					case constants.GIST_ALL_LIST :
						return '/api/gist/list';	
					case constants.GIST_LIST_BY_USER :
						return '/api/gist/user'
					default :
						return '/api/gist/list';	
				}
			}
		})
	;

	return GistItemList;
});