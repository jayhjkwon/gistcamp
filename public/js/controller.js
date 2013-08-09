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
		CommentsWrapperView = require('views/CommentsWrapperView'),
		CreateGistView = require('views/createGistView')
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
				var createListView = new CreateGistView({currentSelectedMenu:'newgist'});
				shellView.main.show(createListView);

				//createListView.getItemInit();


				Application.vent.trigger(constants.MENU_SELECTED,'newgist');
			},

			chat : function(){
				
				// var chatView = new ChatView({currentSelectedMenu: 'chat'})
				// shellView.main.show(chatView);

				// // Chat List on the left region
    //             var chatListWrapperView = new ChatListWrapperView;
				// chatView.chatList.show(chatListWrapperView);

				// // Gist Files on the center region
				// var filesWrapperView = new FilesWrapperView;
				// chatView.filesWrapper.show(filesWrapperView);

				// // Chat on the right region
				// var conversationWrapperView = new ConversationWrapperView;
				// chatView.chatWrapper.show(conversationWrapperView);

				// Application.execute(constants.MENU_SELECTED,'chat');
			}
		})
	;

	return Controller;
});