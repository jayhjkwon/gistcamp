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
			},

			home : function(){
				// LayoutView with regions
				var gistListView = new GistListView({currentSelectedMenu: 'home'});
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getPublicGistList();				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'home');
			},
			
			following : function(){
				// LayoutView with regions
				var gistListView = new GistListView({currentSelectedMenu: 'following'});
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getFriendsGist();				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'following');
			},
			
			myGists : function(){
				// LayoutView with regions
				var gistListView = new GistListView({currentSelectedMenu: 'mygists'});
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getGistListByUser();				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'mygists');
			},
			
			starred : function(){
				// LayoutView with regions
				var gistListView = new GistListView({currentSelectedMenu: 'starred'});
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getStarredGistList();				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'starred');
			},
			
			forked : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'forked'}));
				Application.execute(constants.MENU_SELECTED,'forked');
			},
			
			tagged : function(tag){
				// console.log(tag);
				shellView.main.show(new GistListView({currentSelectedMenu: 'tagged', tag: tag}));
				Application.execute(constants.MENU_SELECTED,'tagged');				
			},
			
			newGist : function(){
				Application.execute(constants.MENU_SELECTED,'newgist');
			}
		})
	;

	return Controller;
});