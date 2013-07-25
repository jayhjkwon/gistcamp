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

		FilesWrapperView = Marionette.ItemView.extend({
			className: 'files',			
			template : filesWrapperTemplate,
			
			initialize: function(options){
				_.bindAll(this, 'onDomRefresh', 'onFilesRefresh');
				Application.commands.setHandler(constants.GIST_ITEM_SELECTED, this.onFilesRefresh);
			},
			
			onDomRefresh: function(){
				var self = this;

				$('.files-wrapper').niceScroll({cursorcolor: '#eee'});
				$('.carousel').carousel({interval: false});

				prettyPrint();
			},

			onFilesRefresh: function(files){
				var self = this;

				function htmlEncode(value){
				  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
				  //then grab the encoded contents back out.  The div never exists on the page.
				  return $('<div/>').text(value).html();
				}

				function htmlDecode(value){
				  return $('<div/>').html(value).text();
				}

				var filesArray = _.toArray(files);

				if (filesArray)
					filesArray[0].isActive = true;

				/*service.getRawFiles(filesArray, function(result){
					self.collection = new Files(result);
					self.render();
				});*/
				
				service.getRawFile(filesArray[0], function(result){
					var html = '';
					html = html + '<div class="item active">';
					html = html + '<pre class="prettyprint linenums">';
					html = html + htmlEncode(result.file_content);
					html = html + '</pre>';
					html = html + '</div>';

					$('.carousel-inner').append(html);
				});

				self.collection = new Files(filesArray);
				self.render();
			},
			
			onClose: function(){
				Application.commands.removeHandler(constants.GIST_ITEM_SELECTED);
			}
		})
	;

	return FilesWrapperView;
});