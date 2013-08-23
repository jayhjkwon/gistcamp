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
		ChatView            = require('views/chatView'),
		ChatItemListView    = require('views/chatItemListView'),
		ConversationWrapperView = require('views/conversationWrapperView'),
		global              = require('global')
	;

	var
		Controller = Marionette.Controller.extend({
			initialize: function(){
				var self = this;
				_.bindAll(this, 'showFooter', 'hideFooter');
			},

			onClose: function(){
			},

			home : function(){
				
				// LayoutView with regions
				var gistListView = new GistListView();
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

				var self = this;
				self.showFooter();
			},
			
			friends : function(){
				

				// LayoutView with regions
				var gistListView = new GistListView();
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getFriendsGistList();				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'following');

				var self = this;
				self.showFooter();
			},
			
			myGists : function(){
				

				// LayoutView with regions
				var gistListView = new GistListView();
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

				var self = this;
				self.showFooter();
			},
			
			starred : function(){
				
				// LayoutView with regions
				var gistListView = new GistListView();
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

				var self = this;
				self.showFooter();

			},
			forked : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'forked'}));
				Application.execute(constants.MENU_SELECTED,'forked');

				var self = this;
				self.showFooter();
			},
			tagged : function(tagId, tagUrl){
				// LayoutView with regions
				var gistListView = new GistListView();
				shellView.main.show(gistListView);

				// Gist Item on the left region
				var gistItemListView = new GistItemListView;
				gistItemListView.getTaggedGistList(tagId, tagUrl);				
				gistListView.gistItemList.show(gistItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				gistListView.filesWrapper.show(filesWrapperView);

				// Comments on the right region
				var commentsWrapperView = new CommentsWrapperView;
				gistListView.commentsWrapper.show(commentsWrapperView);

				Application.execute(constants.MENU_SELECTED,'tagged');
			},
			
			newGist : function(){
				var createListView = new CreateGistView();
				shellView.main.show(createListView);

				Application.execute(constants.MENU_SELECTED,'newgist');

				var self = this;
				self.showFooter();
			},

			chat : function(){

				var chatView = new ChatView()
				shellView.main.show(chatView);

				// Chat List on the left region
                var chatItemListView = new ChatItemListView;
				chatView.chatList.show(chatItemListView);

				// Gist Files on the center region
				var filesWrapperView = new FilesWrapperView;
				chatView.filesWrapper.show(filesWrapperView);

				// Chat on the right region
				var conversationWrapperView = new ConversationWrapperView;
				chatView.chatWrapper.show(conversationWrapperView);

				Application.execute(constants.MENU_SELECTED,'chat');

				var self = this;
				self.hideFooter();

				global.socket.emit('getrooms');
			},
			showFooter : function(){
				$('#main .main-content').css("bottom", "70px");
				$('#footer').show();
			},
			hideFooter : function(){
				$('#main .main-content').css("bottom", "0px");
				$('#main .main-content .chat-wrapper').css("bottom", "0px");
				$('#footer').hide();
			}
		})
	;

	return Controller;
});