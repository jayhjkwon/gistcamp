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
					case constants.GIST_PUBLIC :
						return '/api/gist/public';	
					case constants.GIST_LIST_BY_USER :
						return '/api/gist/user'
					case constants.GIST_STARRED :
						return '/api/gist/starred'
					default :
						return '/api/gist/public';	
				}
			}
		})
	;

	return GistItemList;
});