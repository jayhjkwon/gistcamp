define(function(require){
	var 
		_   				= require('underscore'),
		Marionette 			= require('marionette'),
		Application 		= require('application'),
		GistListView 		= require('views/gistListView'),
		GistItemListView 	= require('views/gistItemListView'),
		shellView 			= require('views/shellView'),		
		constants 			= require('constants'),
		FilesWrapperView    = require('views/filesWrapperView'),
		CommentsWrapperView = require('views/CommentsWrapperView')
	;

	var
		Controller = Marionette.Controller.extend({
			initialize: function(){
				var self = this;
			},

			onClose: function(){
				Application.commands.removeAllHandlers();
			},

			home : function(){
				var gistListView = new GistListView({currentSelectedMenu: 'home'});
				shellView.main.show(gistListView);

				var gistItemListView = new GistItemListView;
				gistItemListView.getPublicGistList();				
				gistListView.gistItemList.show(gistItemListView);

				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.vent.trigger(constants.MENU_SELECTED,'home');
			},
			
			following : function(){
				var gistListView = new GistListView({currentSelectedMenu: 'following'});
				shellView.main.show(this.gistListView);

				var gistItemListView = new GistItemListView;
				gistItemListView.getGistListByUser();				
				this.gistListView.gistItemList.show(gistItemListView);

				Application.vent.trigger(constants.MENU_SELECTED,'following');
			},
			
			myGists : function(){
				var gistListView = new GistListView({currentSelectedMenu: 'mygists'});
				shellView.main.show(gistListView);

				var gistItemListView = new GistItemListView;
				gistItemListView.getGistListByUser();
				
				gistListView.gistItemList.show(gistItemListView);

				Application.vent.trigger(constants.MENU_SELECTED,'mygists');
			},
			
			starred : function(){
				var gistListView = new GistListView({currentSelectedMenu: 'starred'});
				shellView.main.show(gistListView);

				var gistItemListView = new GistItemListView;
				gistItemListView.getStarredGistList();
				
				gistListView.gistItemList.show(gistItemListView);

				Application.vent.trigger(constants.MENU_SELECTED,'starred');
			},
			
			forked : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'forked'}));
				Application.vent.trigger(constants.MENU_SELECTED,'forked');
			},
			
			tagged : function(tag){
				// console.log(tag);
				shellView.main.show(new GistListView({currentSelectedMenu: 'tagged', tag: tag}));
				Application.vent.trigger(constants.MENU_SELECTED,'tagged');				
			},
			
			newGist : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'newgist');
			}
		})
	;

	return Controller;
});