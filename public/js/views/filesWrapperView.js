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

				function htmlEncode(value){
				  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
				  //then grab the encoded contents back out.  The div never exists on the page.
				  return $('<div/>').text(value).html();
				}

				function htmlDecode(value){
				  return $('<div/>').html(value).text();
				}

				var filesArray = _.toArray(gistItem.files);

				if (filesArray){
					filesArray[0].isActive = true;
				}

				_.each(filesArray, function(file){
					if (file.language && file.language.toLowerCase() === 'markdown'){
						file.isMarkdown = true;
					}
				});

				service.getRawFiles(filesArray, function(result){
					self.collection = new Files(result);
					self.render();
					util.loadSpinner(false);
				});
			},
			
			onClose: function(){
				this.subscription.unsubscribe();
			}
		})
	;

	return FilesWrapperView;
});