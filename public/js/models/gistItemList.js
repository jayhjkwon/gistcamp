define(function(require){
	var
		Backbone		= require('backbone'),
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
					case 'GIST_ALL_LIST' :
						return '/api/gist/list';	
					case 'GIST_LIST_BY_USER' :
						return 'api/gist/user'
					default :
						return '/api/gist/list';	
				}
			}
		})
	;

	return GistItemList;
});