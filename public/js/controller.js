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
				shellView.main.show(new GistListView);
			},
			following : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'following');
				shellView.main.show(new GistListView);
			},
			myGists : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'mygists');
				shellView.main.show(new GistListView);
			},
			starred : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'starred');	
				shellView.main.show(new GistListView);
			},
			forked : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'forked');
				shellView.main.show(new GistListView);
			},
			tagged : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'tagged');
				shellView.main.show(new GistListView);
			},
			newGist : function(){
				Application.vent.trigger(constants.MENU_SELECTED,'newgist');
			}
		})
	;

	return Controller;
});