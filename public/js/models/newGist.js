define(function(require){
	var Backbone    = require('backbone'),
		newGistItemList = require('./newGistItemList'),
		NewGist = Backbone.Model.extend({
			initialize : function(props){
				console.log('newGist Model init');

			},
			url : function(){
				return '/api/gist/newgist';
			}
		});

	return NewGist;
});