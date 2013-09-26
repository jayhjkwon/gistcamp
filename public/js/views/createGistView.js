define(function(require){
  var 
  $                  = require('jquery'),
  _            = require('underscore'),
  Marionette         = require('marionette'),
  createGistTemplate = require('hbs!templates/createGistTemplate'),
  CreateGistItemView = require('./createGistItemView'),
  NewGistItem        = require('models/newGistItem'),
  NewGistItemList    = require('models/newGistItemList'),
  GistItem           = require('models/gistItem'),
  nicescroll         = require('nicescroll'),
    // Spinner            = require('spin'),
    util               = require('util'),
    ace                = require('ace/ace'),
    editorList         = [],
    select2            = require('select2'),
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

        $('#main').niceScroll({cursorcolor: '#eee'});

      },
      onShow : function(){
        this.addEditor();

        
      },

      addEditor : function(){
        var self = this;
        var editor = ace.edit('editor');
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/html");
        editor.getSession().setValue("");
        editorList.push(editor);

        var newEdit = $('#editor').attr('id', 'editor' + this.editorSeq);

        this.addSelect2(newEdit.parents('.file').find('.file-extension-name'));
        // newEdit.parents('.file').find('.file-extension-name').select2();

        this.editorSeq++;
        this.setDeleteIcon();
        $("#main").getNiceScroll().resize();
      },
      onRender : function(){
        
      },
      events : {
        'click #add-file' : 'onAddFile',
        'click .btn-delete' : 'onFileDelete',
        'click .create-secrete-gist' : 'onCreateSecreteGist',
        'click .create-public-gist' : 'onCreatePublicGist'
      },
      addSelect2 : function($s){
        $s.select2();

      },


      onAddFile : function(e){
        var self = this;
        var item = new NewGistItem();
        self.collection.add(item);
        console.log($(item));
        this.addSelect2($(item).find('.file-extension-name'));
        // $(item).find('.file-extension-name').select2();
        self.addEditor();
        return false;
      },
      setDeleteIcon : function(){
        if(editorList.length > 1){
          $('.btn-delete').show();
        }else{
          $('.btn-delete').hide();
        }
      },
      onFileDelete : function(e){
        var target = $(e.target).closest('.item');
        var item = $('.item');

        editorList.splice(item.index(target), 1);
        target.remove();

        this.setDeleteIcon();
        return false;
      },
      onCreateSecreteGist : function(e){
        var gistItem = this.setNewGist(false);
        return false;

      },
      onCreatePublicGist : function(e){
        var gistItem = this.setNewGist(true);
        return false;
      },
      setNewGist : function(param)
      {
        var self = this;
        util.loadSpinner(true);

        var list = [];
        var description = $('.gists-description').val();

        var items = $('.file');
        var files = {};


        _.each(items, function(item, idx){
          var content = editorList[idx].getValue();
          var fileName = $(item).find('.file-name').val();
          var extension = $(item).find('.file-extension-name').select2('val');
          files[fileName + '.' + extension]= {'content' : content};
        });

        var gistItem = new GistItem({ description : description, public : param ,files : JSON.stringify(files)});
        gistItem.save()
        .done(function(data){
          window.location.hash = '#mygists';
        })
        .always(function(){
          util.loadSpinner(false);
        });

        return gistItem;
      }
    });


return CreateGistView;

});
