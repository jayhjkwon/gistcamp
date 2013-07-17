define(function(require){
	var 
		Marionette = require('marionette'),
		Application = require('application'),
		GistListView = require('views/gistListView'),
		shellView = require('views/shellView'),
		constants = require('constants')
	;

	var
		Controller = Marionette.Controller.extend({
			home : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'home');
				shellView.main.show(new GistListView({currentSelectedMenu: 'home'}));
			},
			following : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'following');
				shellView.main.show(new GistListView({currentSelectedMenu: 'following'}));
			},
			myGists : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'mygists');
				shellView.main.show(new GistListView({currentSelectedMenu: 'mygists'}));
			},
			starred : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'starred');	
				shellView.main.show(new GistListView({currentSelectedMenu: 'starred'}));
			},
			forked : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'forked');
				shellView.main.show(new GistListView({currentSelectedMenu: 'forked'}));
			},
			tagged : function(tag){
				// console.log(tag);
				Application.vent.trigger(constants.MENU_SELECTED,'tagged');
				shellView.main.show(new GistListView({currentSelectedMenu: 'tagged', tag: tag}));
			},
			newGist : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'newgist');
			}
		})
	;

	return Controller;
});