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
		
		GistItemListView = Marionette.CollectionView.extend({
			className: 'gist-item-container',
			itemView: GistItemView,
			emptyView: NoItemsView,
			collection: new GistItemList,
			currentPage: 1,
			currentGistDataMode: '',
			initialize: function(){
				_.bindAll(this, 'getGistList', 'onRender', 'onScroll');
				this.spinner = new Spinner();
			},
			getGistList: function(){
				var self = this;
				var gistItemList = new GistItemList({'gistDataMode': self.gistDataMode });
				gistItemList.fetch({data: {page: self.currentPage}})
							.done(function(res){
								if (self.currentPage === 1){
									self.collection.set(res.data);
									self.setFirstItemSelected();	
								}else{
									self.collection.add(res.data);
								}
								
								console.log('has next page : ' + res.hasNextPage);})
							.always(function(){
								$('.gist-list').getNiceScroll().resize();
								self.loading(false);
							});
			},
			getAllGistList: function(){
				this.currentGistDataMode = constants.GIST_ALL_LIST;
				this.getGistList(constants.GIST_ALL_LIST);
			},
			getGistListByUser: function(){
				this.currentGistDataMode = constants.GIST_LIST_BY_USER;
				this.getGistList(constants.GIST_LIST_BY_USER);
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
			},
			onRender : function(){
				console.log('rendered');
				$('.gist-list').niceScroll({cursorcolor: '#eee'});

				// register scroll event handler, this shuld be registered after view rendered
				$('.gist-list').off('scroll').on('scroll', this.onScroll);
			},
			onScroll : function(){
				var w = $('.gist-list');
				if(w.scrollTop() + w.height() == $('.gist-item-container').height()) {
		       		this.loadMore();
			    }
			},
			loadMore: function(){
				this.loading(true);
				this.currentPage = this.currentPage + 1;
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
			}

		})
	;

	return GistItemListView;
});