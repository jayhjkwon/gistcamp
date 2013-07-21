define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),
		nicescroll 		= require('nicescroll'),
		Handlebars      = require('handlebars'),
		GistItemView	= require('./gistItemView'),
		NoItemsView		= require('./NoItemsView'),
		GistItemList	= require('models/gistItemList'),
		
		GistItemListView = Marionette.CollectionView.extend({
			className: 'gist-item-container',
			itemView: GistItemView,
			emptyView: NoItemsView,
			collection: new GistItemList,
			initialize: function(){
				_.bindAll(this, 'getGistList');
			},
			getGistList: function(gistDataMode){
				var self = this;
				var gistItemList = new GistItemList({'gistDataMode': gistDataMode });
				gistItemList.fetch({data: {page:100}}).done(function(res){
					self.collection.set(res.data);
					self.setFirstItemSelected();
					console.log('has next page : ' + res.hasNextPage);
				});
			},
			getAllGistList: function(){
				this.getGistList('GIST_ALL_LIST');
			},
			getGistListByUser: function(){
				this.getGistList('GIST_LIST_BY_USER');
			},  			
			setFirstItemSelected: function(){
		    	$('.gist-item').first().addClass('selected');
		    },
		    events : {
				'click .gist-item' : 'onGistItemSelected'
			},
			onGistItemSelected : function(e){
				$('.gist-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');
				$('.comments-badge').hide().show(500);
			}
		})
	;

	return GistItemListView;
});