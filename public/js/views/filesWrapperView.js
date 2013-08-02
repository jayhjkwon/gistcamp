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
		markdown        = require('markdown'),

		FilesWrapperView = Marionette.ItemView.extend({
			className: 'files',			
			template : filesWrapperTemplate,
			
			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'bindFiles', 'onItemSelected', 'onRefreshRequested');
				this.spinner = new Spinner({length:7});
				this.subscriptionItemSelected = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
				this.subscriptionReload = postalWrapper.subscribe(constants.GIST_ITEM_RELOAD, this.onRefreshRequested);
			},
			
			onDomRefresh: function(){
				var self = this;

				$('.files-wrapper').niceScroll({cursorcolor: '#eee'});
				$('.carousel').carousel({interval: false});

				prettyPrint();
			},

			bindFiles : function(gistItem){
				var self = this;
				var filesArray = _.toArray(gistItem.files);

				if (filesArray){
					filesArray[0].isActive = true;
				}

				if (self.refreshRequested || (filesArray && !filesArray[0].file_content)){	// in case that file contents are not set yet
					if (self.refreshRequested)
						$('.icon-refresh').removeClass('icon-spin').addClass('icon-spin');
					else
						self.loading(true);

					self.collection = new Files(filesArray);
					self.collection.fetch({data: {files: filesArray}})
					.done(function(){
						_.each(self.collection.models, function(file){
							if (file.get('language') && file.get('language').toLowerCase() === 'markdown' && file.get('file_content')){
								file.set('isMarkdown', true);
								file.set('file_content', markdown.toHTML(file.get('file_content')));
							}
						});
						self.render();						
					})
					.always(function(){
						self.loading(false);	
						if (self.refreshRequested){
							self.refreshRequested = false;
							$('.icon-refresh').removeClass('icon-spin');
						}
					});

				}else{
					self.collection = new Files(filesArray);
					self.render();
				}
			},

			onItemSelected: function(gistItem){
				this.selectedGistItem = gistItem;	// for refreshing files later
				this.bindFiles(gistItem);
			},

			onRefreshRequested : function(){
				var self = this;
				self.refreshRequested = true;
				self.bindFiles(self.selectedGistItem);
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
				this.subscriptionItemSelected.unsubscribe();
				this.subscriptionReload.unsubscribe();
			}
		})
	;

	return FilesWrapperView;
});