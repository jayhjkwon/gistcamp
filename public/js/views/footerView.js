define(function(require){
	var
		Marionette      = require('marionette'),
		footerTemplate  = require('hbs!templates/footerTemplate'),
		postalWrapper   = require('postalWrapper'),
		constants 		= require('constants'),		

		FooterView = Marionette.Layout.extend({
			className: 'command-buttons',
			template : footerTemplate,
			
			initialize: function(){
				this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
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