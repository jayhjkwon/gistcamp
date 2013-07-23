define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		filesWrapperTemplate= require('hbs!templates/filesWrapperTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),		
		File            = require('models/file'),
		Files           = require('models/files'),

		FilesWrapperView = Marionette.ItemView.extend({
			className: 'files',			
			template : filesWrapperTemplate,
			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onFilesRefresh');
				Application.commands.setHandler('files', this.onFilesRefresh);
			},
			onDomRefresh: function(){
				var self = this;

				$('.files-wrapper').niceScroll({cursorcolor: '#eee'});
				$('.carousel').carousel({interval: false});

				prettyPrint();
			},
			onFilesRefresh: function(files){
				var filesArray = _.toArray(files);
				this.collection = new Files(filesArray);
				this.render();
			},
			onClose: function(){
				Application.commands.removeHandler('files');
			}
		})
	;

	return FilesWrapperView;
});