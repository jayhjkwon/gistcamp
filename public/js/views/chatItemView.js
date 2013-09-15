define(function(require) {
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		chatItemTemplate= require('hbs!templates/chatItemTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),	
		postalWrapper   = require('postalWrapper'),	
		util            = require('util'),
		Spinner         = require('spin'),
		global          = require('global'),


		ChatItemView = Marionette.ItemView.extend({			
			template : chatItemTemplate,
			className: 'row-fluid',

			initialize: function(options){
				_.bindAll(this, 'onGistItemSelected', 'onAddClassSelected', 'onViewFileContent');
				//this.subscriptionRemoveIsSelected = postalWrapper.subscribe(constants.REMOVE_IS_SELECTED, this.setIsSelectedGistFalse);
			},

			events : {
				'click .chat-item' : 'onGistItemSelected',
				'click .file-content' : 'onViewFileContent'
			},

			ui : {
				divChatItem : '.chat-item',
				btnView : '.file-content'
			},

			onViewFileContent: function(e){
				//var url = 'http://localhost:3000/popupFileView';
				//var url = 'http://gistcamp.com/popupFileView';
				var title = 'GistCamp';
				this.popupWindow('', title, '800', '600');
			},

			popupWindow: function(url, title, w, h){
				var left, top, newWindow, dualScreenLeft, dualScreenTop;

		    	dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		    	dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
			    left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
			    top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
			    newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

				var popupLayoutContent = '<!DOCTYPE html>'
				+ '<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->' 
				+ '<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->'
				+ '<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->'
				+ '<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->'
				+ '<head>'
				   + ' <meta charset="utf-8">'
				   + ' <meta name="description" content="gist github">'
				   + ' <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
				   + ' <title>GistCamp</title>'
				   + ' <link rel="shortcut icon" href="images/logo_black.png">'
				   + ' <link href="http://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css">'
				   + ' <link rel="stylesheet" href="vendor/bootstrap/docs/assets/css/bootstrap.css">'
				   + ' <link rel="stylesheet" href="vendor/bootstrap/docs/assets/js/google-code-prettify/prettify.css">'
				   + ' <link rel="stylesheet" href="vendor/font-awesome/css/font-awesome.min.css">'
				   + ' <link rel="stylesheet" href="vendor/toastr/toastr.css" />'
				   + ' <link rel="stylesheet" href="styles/app.min.css" />'
				   + ' <script src="vendor/modernizr/modernizr.js"></script>'
				  + '</head>'
				  + '<body>';

			    var content = $('#files-wrapper').html() + '</body></html>';
			    popupLayoutContent += content;
			    console.log(popupLayoutContent);
				newWindow.document.write(popupLayoutContent);

			    if (window.focus) {
			        newWindow.focus();
			    }
			}, 

			// setIsSelectedGistFalse: function(context){ 
			// 	if (context !== this) {
			// 		this.isSelectedGist = false; 
			// 		this.ui.btnView.hide();
			// 	}
			// },

			onGistItemSelected : function(e){
				this.isSelectedGist = true;
				
				global.socket.emit('switchRoom', this.model.id);

				$('.chat-item').removeClass('selected');
				$(e.currentTarget).addClass('selected');

				//$('.btn btn-danger file-content').hide();
				
				// Application.execute(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				postalWrapper.publish(constants.GIST_ITEM_SELECTED, this.model.toJSON());
				//postalWrapper.publish(constants.REMOVE_IS_SELECTED, this);
			},

			onAddClassSelected : function() {

				$('.chat-item').removeClass('selected');
				this.ui.divChatItem.addClass('selected');

				this.ui.btnView.show();
			}
		})
	;

	return ChatItemView;
});