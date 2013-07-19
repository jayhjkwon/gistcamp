define(function(require){
	var 
		Marionette 			= require('marionette'),
		Application 		= require('application'),
		GistListView 		= require('views/gistListView'),
		GistItemListView 	= require('views/gistItemListView'),
		shellView 			= require('views/shellView'),		
		constants 			= require('constants')
	;

	var
		Controller = Marionette.Controller.extend({
			home : function(){
				var gistListView = new GistListView({currentSelectedMenu: 'home'});
				shellView.main.show(gistListView);

				var gistItemListView = new GistItemListView;
				gistItemListView.getGistList();
				
				gistListView.gistItemList.show(gistItemListView);

				Application.vent.trigger(constants.MENU_SELECTED,'home');
			},
			following : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'following'}));
				Application.vent.trigger(constants.MENU_SELECTED,'following');				
			},
			myGists : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'mygists'}));
				Application.vent.trigger(constants.MENU_SELECTED,'mygists');
			},
			starred : function(){
				shellView.main.show(new GistListView({currentSelectedMenu: 'starred'}));
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