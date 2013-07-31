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
		Spinner         = require('spin'),

		FilesWrapperView = Marionette.ItemView.extend({
			className: 'files',			
			template : filesWrapperTemplate,
			
			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onItemSelected');
				this.spinner = new Spinner({length:7});
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},
			
			onDomRefresh: function(){
				var self = this;

				$('.files-wrapper').niceScroll({cursorcolor: '#eee'});
				$('.carousel').carousel({interval: false});

				prettyPrint();
			},

			onItemSelected: function(gistItem){
				var self = this;
				var filesArray = _.toArray(gistItem.files);

				if (filesArray){
					filesArray[0].isActive = true;
				}

				if (filesArray && !filesArray[0].file_content){
					self.loading(true);

					self.collection = new Files(filesArray);
					self.collection.fetch({data: {files: filesArray}})
					.done(function(){
						self.render();						
					})
					.always(function(){
						self.loading(false);	
					});

				}else{
					self.collection = new Files(filesArray);
					self.render();
				}
			},

			loading: function(showSpinner){
				if (showSpinner){
					var target = $('#pivot')[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
				}
			},
			
			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;

	return FilesWrapperView;
});