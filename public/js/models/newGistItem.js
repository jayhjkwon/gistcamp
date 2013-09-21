define(function(require){
	var
		Backbone    = require('backbone'),
		NewGistItem = Backbone.Model.extend({
			initialize : function(){
				console.log('newGistItem init');
			},
			defaults : {
				fileName : '',
				fileType : ''
			}
		});

	return NewGistItem;
});