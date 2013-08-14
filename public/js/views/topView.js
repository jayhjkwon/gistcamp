define(function(require){
	var
		$             = require('jquery'),
		_             = require('underscore'),
		Marionette    = require('marionette'),
		topTemplate   = require('hbs!templates/topTemplate'),
		Application   = require('application'),
		constants     = require('constants'),
		global        = require('global'),
		TagItemList   = require('models/tagItemList'),
		postalWrapper = require('postalWrapper'),		

		TopView = Marionette.ItemView.extend({
			className: 'navbar-inner',
			template: topTemplate,

			initialize: function(){
				console.log('TopView initialized');
				var self = this;
				_.bindAll(this, 'activateMenu', 'showTagInfo', 'onTagChanged');

				Application.commands.setHandler(constants.MENU_SELECTED, function(menu){
					self.activateMenu(menu);
				});				

				this.showTagInfo();

				this.subscription = postalWrapper.subscribe(constants.TAG_CHANGED, this.onTagChanged);
			},

			events: {
				'click #btn-refresh' : 'onRefreshClick'
			},

			onRender: function(){
				this.showUserInfo();
			},

			showTagInfo: function(){
				var self = this;
				self.collection = new TagItemList();
				self.collection.fetch();
			},

			onTagChanged: function(tags){
				var self = this;
				
				self.collection.fetch().done(function(result){
					self.render();		
				});
			},

			showUserInfo: function(){
				$('#loggedin-user-name').text(global.user.name);
				$('.loggedin-user-avatar').attr('src', global.user.avatar);
			},

			onRefreshClick: function(e){
				window.location.reload(true);
			},			

			activateMenu: function(menu){
				this.removeActiveClass();						
				$('.nav li a[href="#' + menu + '"]').parent().addClass('active');
			},

			removeActiveClass: function(){
				$('.nav li').removeClass('active');
			},

			onClose: function(){
				this.subscription.unsubscribe();
			}

		})
	;

	// note that returning instance of TopView so that only one instance will be created 
	// in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
	return new TopView;		
});