define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		gistItemTemplate= require('hbs!templates/gistItemTemplate'),
		Application 	= require('application'),
		constants       = require('constants'),
		postalWrapper   = require('postalWrapper'),
		
		GistItemView 	= Marionette.ItemView.extend({
			template: gistItemTemplate,
			className: 'row-fluid',

			initialize: function(){
				_.bindAll(this, 'onGistItemSelected');
			},
			
			events : {
				'click .gist-item' : 'onGistItemSelected'
			},

			onGistItemSelected : function(e){
				$('.gist-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				$('.comments-badge').hide().show(300);

				// Application.execute(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
			},
		});

		return GistItemView;
});