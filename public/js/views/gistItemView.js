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
			isSelectedGist : false,

			initialize: function(){
				var self = this;
				_.bindAll(this, 'onGistItemSelected', 'onTagChanged', 'onClose', 'setIsSelectedGistFalse');
				this.subscription = postalWrapper.subscribe(constants.TAG_CHANGED, this.onTagChanged);
				this.subscriptionRemoveIsSelected = postalWrapper.subscribe(constants.REMOVE_IS_SELECTED, this.setIsSelectedGistFalse);
			},
			
			events : {
				'click .gist-item' : 'onGistItemSelected'
			},

			setIsSelectedGistFalse: function(context){ 
				if (context !== this) 
					this.isSelectedGist = false; 
			},
			
			onGistItemSelected : function(e){
				this.isSelectedGist = true;

				/*$('.gist-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				$('.comments-badge').hide().show(300);*/

				$('.gist-item-container .row-fluid').removeClass('selected');
				$(e.currentTarget).parents('.row-fluid').addClass('selected');
				$('.comments-badge').hide().show(300);

				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());				
				postalWrapper.publish(constants.REMOVE_IS_SELECTED, this);	// in order for setting isSelectedGist boolean variable as false in other instances of GistItemView
			},

			onTagChanged: function(tags){
				var self = this;
				if (self.isSelectedGist){
					// find tags owned by this gist
					var tagNames = _.filter(tags, function(tag){
						var isIn = _.where(tag.gists, {'gist_id':self.model.get('id')});
						return isIn.length;
					});

					var userTags = _.pluck(tagNames, 'tag_name');
					self.model.set('tags', userTags);
					self.render();
				}
			},

			onClose: function(){
				this.subscription.unsubscribe();
				this.subscriptionRemoveIsSelected.unsubscribe();
			}
		});

		return GistItemView;
});