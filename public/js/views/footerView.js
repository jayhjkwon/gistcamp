define(function(require){	
	var
		Marionette      = require('marionette'),
		footerTemplate  = require('hbs!templates/footerTemplate'),
		postalWrapper   = require('postalWrapper'),
		constants 		= require('constants'),		
		// socket          = require('socketWrapper'),

		FooterView = Marionette.Layout.extend({
			className: 'command-buttons',
			template : footerTemplate,
			
			initialize: function(){
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			events : {
				'click .btn-command-wrapper btn-chats' : 'onRoomCreated'
			},

			onRoomCreated : function(e){

				// connect는 나중에 Access token을 받는 부분으로 이동해야 한다.
				// on connection to server, ask for user's name with an anonymous callback
				// socket.on('connect', function(){
				// 	// call the server-side function 'adduser' and send one parameter (value of prompt)
				// 	socket.emit('adduser', prompt("What's your name?"));
				// });

				// socket.emit('addroom', prompt("What's room name?"));

			},

			onItemSelected : function(gistItem){
				if (gistItem && gistItem.comments > 0){
					$('.comments-badge').text(gistItem.comments).show();
				}else{
					$('.comments-badge').text('').hide();
				}
			},

			close: function(){
				this.subscription.unsubscribe();
			}
		})
	;


	// note that returning instance of FooterView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new FooterView;

});