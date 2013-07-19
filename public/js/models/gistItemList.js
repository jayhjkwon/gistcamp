define(function(require){
	var
		Backbone		= require('backbone'),
		GistItem 		= require('./gistItem'),
		GistItemList	= Backbone.Collection.extend({
			model: GistItem,
			urlRoot : '/api/gist/list',
			url 	: function(){
				return this.urlRoot;
			}
		})
	;

	return GistItemList;
});