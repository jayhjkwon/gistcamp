define(function(require){
	var 
		Marionette = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = require('./createGistItemView'),
		//AceEditor = require('aceeditor'),

		// CreateGistView = Marionette.ItemView.extend({
		// 	template: createGistTemplate
		// });
		
		CreateGistView = Marionette.CompositeView.extend({
			template : createGistTemplate,
			itemView : CreateGistItemView,
			itemViewContainer : '#gist-item-container',

			initialize : function(){
				console.log('createGistView initialize');
			}
		});


	return CreateGistView;

});
