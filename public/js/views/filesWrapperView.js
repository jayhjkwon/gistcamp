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
		service         = require('service'),
		util            = require('util'),
		postalWrapper   = require('postalWrapper'),

		FilesWrapperView = Marionette.ItemView.extend({
			className: 'files',			
			template : filesWrapperTemplate,
			
			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected');
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},
			
			onDomRefresh: function(){
				var self = this;

				$('.files-wrapper').niceScroll({cursorcolor: '#eee'});
				$('.carousel').carousel({interval: false});

				prettyPrint();
			},

			onItemSelected: function(gistItem){
				console.log('onItemSelected in FilesWrapperView');
				util.loadSpinner(true);

				var self = this;

				var filesArray = _.toArray(gistItem.files);

				if (filesArray){
					filesArray[0].isActive = true;
				}

				/*self.collection = new Files(filesArray);
				self.render();*/

				_.each(filesArray, function(file){
					if (file.language && file.language.toLowerCase() === 'markdown'){
						file.isMarkdown = true;
					}
				});

				self.collection = new Files();
				self.collection.fetch({data: {files: filesArray}})
					.done(function(){
						self.render();						
					})
					.always(function(){
						util.loadSpinner(false);	
					});

				

				/*service.getRawFiles(filesArray, function(result){
					self.collection = new Files(result);
					self.render();
					util.loadSpinner(false);
				});*/
			},
			
			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;

	return FilesWrapperView;
});