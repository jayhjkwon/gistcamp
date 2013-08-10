define(function(require){
	var 
		$                  = require('jquery'),
		Marionette         = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = require('./createGistItemView'),
		NewGistItem        = require('models/newGistItem'),
		NewGistItemList    = require('models/newGistItemList'),
		nicescroll         = require('nicescroll'),
		ace                = require('ace/ace'),

		CreateGistView     = Marionette.CompositeView.extend({
			template : createGistTemplate,
			itemView : CreateGistItemView,
			itemViewContainer : '#gist-item-container',			
			editorSeq : 0,

			initialize : function(){
				var self = this;
				var item = new NewGistItem();
				self.collection = new NewGistItemList();
				self.collection.add(item);
				//$('.create-gist-container').niceScroll({cursorcolor: '#eee'});
				

			},
			onShow : function(){
				this.addEditor();
			},

			addEditor : function(){
				var editor = ace.edit('editor');
				editor.getSession().setValue("");
				// editor.setTheme('ace/theme/monokai');
    //     		editor.getSession().setMode('ace/mode/javascript');

				$('#editor').attr('id', 'editor' + this.editorSeq);

				this.editorSeq++;

				$('#main').niceScroll({cursorcolor: '#eee'});


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
				this.addEditor();
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
