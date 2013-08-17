define(function(require){
	var 
		$                  = require('jquery'),
		_ 				= require('underscore'),
		Marionette         = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = require('./createGistItemView'),
		NewGistItem        = require('models/newGistItem'),
		NewGistItemList    = require('models/newGistItemList'),
		GistItem           = require('models/gistItem'),
		nicescroll         = require('nicescroll'),
		ace                = require('ace/ace'),
		editorList        = [],
		CreateGistView     = Marionette.CompositeView.extend({
			template : createGistTemplate,
			itemView : CreateGistItemView,
			itemViewContainer : '#gist-item-container',			
			editorSeq : 0,
			tagName : 'div',
			className : 'create-gist',

			initialize : function(){
				var self = this;
				var item = new NewGistItem();
				self.collection = new NewGistItemList();
				self.collection.add(item);
			},
			onShow : function(){
				this.addEditor();
			},

			addEditor : function(){
				var self = this;
				var editor = ace.edit('editor');
				editor.getSession().setValue("");
				editorList.push(editor);

				$('#editor').attr('id', 'editor' + this.editorSeq);
				this.editorSeq++;

				$('#main').niceScroll({cursorcolor: '#eee'});
			},
			onRender : function(){

			},
			events : {
				'click #add-file' : 'onAddFile',
				'click .btn-delete' : 'onFileDelete',
				'click .create-secrete-gist' : 'onCreateSecreteGist',
				'click .create-public-gist' : 'onCreatePublicGist'
			},
			onAddFile : function(e){
				var self = this;
				var item = new NewGistItem();
				self.collection.add(item);
				self.addEditor();
				return false;
			},
			onFileDelete : function(e){
				var target = $(e.target).closest('.item');
				var item = $('.item');

				editorList.splice(item.index(target), 1);
				target.remove();

				return false;
			},
			onCreateSecreteGist : function(e){
				var gistItem = this.setNewGist(false);
				console.log(gistItem.toJSON());
				return false;

			},
			onCreatePublicGist : function(e){
				var gistItem = this.setNewGist(true);

				console.log(gistItem.toJSON());
				return false;
			},
			setNewGist : function(param)
			{
				var list = [];
				var description = $('.gists-description').val();

				var items = $('.file');
				var files = {};


				_.each(items, function(item, idx){

					var content = editorList[idx].getValue();
					var fileName = $(item).find('.file-name').val() + '.txt';
										
					files[fileName]= {'content' : content};

				});

				var gistItem = new GistItem({ description : description, public : param ,files : JSON.stringify(files)});
				gistItem.save()
				.done(function(data){
					
				})
				.always(function(){
					alert('success');
				});

				return gistItem;
			}



		});


	return CreateGistView;

});
