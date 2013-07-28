define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),		
		Handlebars      = require('handlebars'),
		Spinner         = require('spin'),
		GistItemView	= require('./gistItemView'),
		NoItemsView		= require('./NoItemsView'),
		GistItemList	= require('models/gistItemList'),
		constants       = require('constants'),
		util            = require('util'),
		
		GistItemListView = Marionette.CollectionView.extend({
			className: 'gist-item-container',
			itemView: GistItemView,
			collection: new GistItemList,
			currentGistDataMode: '',
			initialize: function(){
				_.bindAll(this, 'getGistList', 'onRender', 'onScroll');
				this.spinner = new Spinner();
				util.loadSpinner(true);
			},
			events : {
			},
			getGistList: function(){
				var self = this;
				var gistItemList = new GistItemList({'gistDataMode': self.currentGistDataMode });
				gistItemList.fetch({data: {linkHeader: self.linkHeader}})
					.done(function(res){
						if (!self.linkHeader){
							self.collection.set(res.data);
							self.setFirstItemSelected();
						}else{
							self.collection.add(res.data);
						}
						
						if (res.hasNextPage){
							self.linkHeader = res.linkHeader;
						}else{
							self.lastPage = true;
							self.showEndofDataSign();									
						}						
					})
					.always(function(){
						$('.gist-list').getNiceScroll().resize();
						self.loading(false);
						util.loadSpinner(false);
					});
			},
			getPublicGistList: function(){
				this.currentGistDataMode = constants.GIST_PUBLIC;
				this.getGistList(constants.GIST_PUBLIC);
			},
			getGistListByUser: function(){
				this.currentGistDataMode = constants.GIST_LIST_BY_USER;
				this.getGistList(constants.GIST_LIST_BY_USER);
			},  
			getStarredGistList: function(){
				this.currentGistDataMode = constants.GIST_STARRED;
				this.getGistList(constants.GIST_STARRED);
			},
			getFriendsGist: function(){
				this.currentGistDataMode = constants.GIST_FRIENDS_GISTS;
				this.getGistList(constants.GIST_FRIENDS_GISTS);
			},		
			setFirstItemSelected: function(){
		    	$('.gist-item').first().trigger('click');
		    },		    
			onRender : function(){
				$('.gist-list').niceScroll({cursorcolor: '#eee'});

				// register scroll event handler, this shuld be registered after view rendered
				$('.gist-list').off('scroll').on('scroll', this.onScroll);
			},
			onDomRefresh: function(){
				// util.loadSpinner(false);
			},
			onScroll : function(){
				var w = $('.gist-list');
				if(w.scrollTop() + w.height() == $('.gist-item-container').height()) {
		       		this.loadMore();
			    }
			},
			loadMore: function(){
				if(self.lastPage) return;
				this.loading(true);
				this.getGistList();
			},
			loading: function(showSpinner){
				if (showSpinner){
					$('#gist-item-list').append('<div style="height:100px;" class="loading"></div>');
					var target = $('#gist-item-list .loading')[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
					$('.loading').remove();	
				}
			},
			showEndofDataSign: function(){
				$('#gist-item-list').append('<div style="height:50px;font-size:15px;font-weight:bold;text-align:center;">End of Data..</div>');
			}

		})
	;

	return GistItemListView;
});