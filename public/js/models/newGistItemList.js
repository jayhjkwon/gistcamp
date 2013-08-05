define(function(require){
	var
		Backbone        = require('backbone'),
		NewGistItem     = require('./newGistList'),
		NewGistItemList = Backbone.Collection.extend({
			model : NewGistItem,
			initialize: function(props){
				console.log('newGistItemList init');
			},
		});

	return NewGistItemListe;
})