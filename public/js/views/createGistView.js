define(function(require){
	var 
		$                  = require('jquery'),
		_ 				= require('underscore'),
		Marionette         = require('marionette'),
		createGistTemplate = require('hbs!templates/createGistTemplate'),
		CreateGistItemView = require('./createGistItemView'),
		NewGistItem        = require('models/newGistItem'),
		NewGistItemList    = require('models/newGistItemList'),
		NewGist            = require('models/newGist'),
		nicescroll         = require('nicescroll'),
		ace                = require('ace/ace'),
		editorList        = [],
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
				//$('#main').niceScroll({cursorcolor: '#eee'});
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
				var newGist = this.setNewGist();
				newGist.set('public', false);
				console.log(newGist.toJSON());
				return false;

			},
			onCreatePublicGist : function(e){
				var newGist = this.setNewGist();
				newGist.set('public', true);

				console.log(newGist.get('files'));
				return false;
			},
			setNewGist : function(e)
			{

				// var newGist = new NewGist();
				var list = [];
				var description = $('.gists-description').val();

				// newGist.set("description", description);

				var items = $('.file');

				_.each(items, function(item, idx){

					var contents = editorList[idx].getValue();

					var fileName = $(item).find('.file-name').val() + '.txt';
					
					var gist = {};
					gist[fileName] = {'contents' : contents};

					list.push(gist);

				});

				var newGist = new NewGist({ description : description });
				// newGist.set('files', list);
				newGist.save()
				.done(function(data){
					alert(1);
				})
				.always(function(){
					alert(2);
				});

				return newGist;
			}



		});


	return CreateGistView;

});
