define(function(require){
	var 
		$                  = require('jquery'),
		Marionette         = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = require('./createGistItemView'),
		NewGistItem        = require('models/newGistItem'),
		NewGistItemList    = require('models/newGistItemList'),
		nicescroll         = require('nicescroll'),
		ace                = require('ace'),
		CreateGistView     = Marionette.CompositeView.extend({
			template : createGistTemplate,
			itemView : CreateGistItemView,
			itemViewContainer : '#gist-item-container',
			//model : NewGistItem,
			//collection : NewGistItemList,
			
			initialize : function(){
				var self = this;
				var item = new NewGistItem();
				self.collection = new NewGistItemList();
				self.collection.add(item);
				//$('.create-gist-container').niceScroll({cursorcolor: '#eee'});
				//$('#main').niceScroll({cursorcolor: '#eee'});
				
				console.log( self.collection);

			},
			onRender : function(){

			},
			events : {
				'click #add-file' : 'onAddFile',
				'click .btn-delete' : 'onFileDelete'
			},
			onAddFile : function(){
				var self = this;
				var item = new NewGistItem();
				self.collection.add(item);
				//$('#main').niceScroll({cursorcolor: '#eee'});
				return false;
			},
			onFileDelete : function(){
				alert(111);
				return false;
			},


		});


	return CreateGistView;

});
