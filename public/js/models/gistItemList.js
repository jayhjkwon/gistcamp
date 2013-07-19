define(function(require){
	var
		Backbone		= require('backbone'),
		GistItem 		= require('./gistItem'),
		GistItemList	= Backbone.Collection.extend({
			model: GistItem,
			url : function(){
				return '/api/gist/list';
			}
		})
	;

	return GistItemList;
});