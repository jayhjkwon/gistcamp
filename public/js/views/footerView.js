define(function(require){ 
  var
  $               = require('jquery'),
  _               = require('underscore'),
  Marionette      = require('marionette'),
  footerTemplate  = require('hbs!templates/footerTemplate'),
  postalWrapper   = require('postalWrapper'),
  constants     = require('constants'),   
  store           = require('store'),
  bootstrap       = require('bootstrap'),
  TagItem         = require('models/tagItem'),
  TagItemList     = require('models/tagItemList'),
  tagListTemplate = require('hbs!templates/tagListTemplate'),
  global          = require('global'),
  Router          = require('router'),
  Spinner         = require('spin'),
  service         = require('service'),
  GistItem        = require('models/gistItem'),
  util            = require('util'),

  FooterView = Marionette.ItemView.extend({
    className: 'command-buttons',
    template : footerTemplate,

    initialize: function(){
      _.bindAll(this, 'popupWindow', 'deleteTag', 'sharePocket', 'shareEverNote', 'onTagItemHover', 'shareWo', 'shareGg', 'shareFB', 'shareTW', 'shareFB', 'initializePopOverTag', 'onItemSelected', 'star', 'createTag', 'loading', 'onBtnCommentClick', 'onRoomCreated', 'tagOnGist', 'onCommentDeleted', 'onCommentAdded', 'onTagCollectionChange', 'initializePopOverShare');

      this.tags = new TagItemList();

      this.listenTo(this.tags, 'all', this.onTagCollectionChange);
      this.spinner = new Spinner({length:5,lines:9,width:4,radius:4});
      this.subscription = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
      this.subscriptionDeleteComment = postalWrapper.subscribe(constants.COMMENT_DELETE, this.onCommentDeleted);
      this.subscriptionAddComment = postalWrapper.subscribe(constants.COMMENT_ADD, this.onCommentAdded);
      this.subscriptionStar = postalWrapper.subscribe(constants.STAR, this.star); 
      this.router = new Router();
    },

    events: {
      'click .btn-comments'    : 'onBtnCommentClick',
      'click .btn-reload'      : 'onReloadClick',
      'click .btn-chats'       : 'onRoomCreated',
      'keydown #new-tag'       : 'createTag',
      'click .tag-popup ul li a' : 'tagOnGist',
      'click .btn-star'        : 'star',
      'click .share-with-others'    : 'shareWo',
      'click .share-google'    : 'shareGg',
      'click .share-facebook'  : 'shareFB',
      'click .share-twitter'   : 'shareTW',
      'click .share-linkedin'  : 'shareLnk',
      'click .share-evernote'  : 'shareEverNote',
      'click .share-pocket'    : 'sharePocket',
      'click .tag'             : 'onTagButtonClick',
      'click .btn-del-tag'     : 'deleteTag',
      'click .btn-delete-gist' : 'onDeleteGist'
    },

    ui : {
      btnTag   : '.btn-command-wrapper.tag',
      btnShare : '.btn-share'
    },

    onRender: function(){
      this.initializePopOverTag();  
      this.initializePopOverShare();  
    },

    onTagButtonClick: function(){
      var self = this;
      
        // unbind hover event first
        $('.tag-popup ul li').off('mouseenter mouseleave');

        // register hover event
        $('.tag-popup ul li').hover(self.onTagItemHover, function(){
          self.$el.find('.btn-del-tag').fadeOut(100);
        });   
      },

      onTagItemHover: function(e){
        $(e.target).find('.btn-del-tag').show();
      },

      initializePopOverTag: function(){
        var self = this;
        this.ui.btnTag.popover({
          html  : true,
          placement: 'top',
          title : function(){ return '<div><i class="icon-tag"></i> Tag gist</div>'; },
          content : function(){ return $('.tag-area').html(); }         
        });

        this.tags.fetch();  
      },

      initializePopOverShare: function(){
        this.ui.btnShare.popover({
          html  : true,
          placement: 'top',
          title : function(){ return '<div><i class="icon-share"></i> Share gist</div>'; },
          content : function(){ return $('.share-area').html(); }         
        });
      },

      onTagCollectionChange: function(event_name){
        var self = this;

        //get tags for the selected gist
        if (self.model){
          var tagNames =  self.model.get('tags');
          self.tags.each(function(tag){
            var exist = _.contains(tagNames, tag.get('tag_name'));
            if (exist) 
              tag.set('is_tagged', true);
            else
              tag.set('is_tagged', false);
          });

          // refresh only tag popup contents
          if ($('.tag-popup').length){
            self.$el.find('.tag-popup').replaceWith(tagListTemplate({tags: self.tags.toJSON()}));
          }else{
            $('.tag-area').html(tagListTemplate({tags: self.tags.toJSON()})); 
          }

          // force registering hover event on tag item in tag popup
          self.onTagButtonClick();      
        }       
      },

      createTag: function(e){
        var self = this;
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13 && !self.saving){
          self.saving = true;
          self.loading(true, e.target);
          
          var tagName = $(e.target).val();
          var tag = new TagItem({gistId: self.model.get('id'), tagName:tagName});
          tag.save()
          .done(function(data){
            var tagNames = self.model.get('tags');
            tagNames.push(tagName);
            self.model.set('tags', tagNames);

            self.tags.reset(data);                            
            self.ui.btnTag.popover('show');
            $(e.target).val('');
            postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());

              // force registering hover event on tag item in tag popup
              self.onTagButtonClick();  
            })
          .always(function(){
            self.saving = false;
            self.loading(false);
          });
        }
      },

      deleteTag: function(e){
        var self = this;
        self.saving = true;
        self.loading(true, e.target);
        
        var tagId = $(e.target).siblings('a').attr('data-tag-id');
        var tagName = $(e.target).siblings('a').attr('data-tag-name');
        var tag = new TagItem({id: tagId});
        tag.destroy().done(function(data){
          var tagNames = self.model.get('tags');
          self.model.set('tags', _.without(tagNames, tagName));

          self.tags.reset(data);                            
          self.ui.btnTag.popover('show');
          postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());

            // force registering hover event on tag item in tag popup
            self.onTagButtonClick();  
          })
        .always(function(){
          self.saving = false;
          self.loading(false);
        });
      },

      tagOnGist: function(e){
        e.preventDefault();
        var self = this;
        
        var tagId = $(e.target).attr('data-tag-id');
        var tagName = $(e.target).attr('data-tag-name');
        var gistId = this.model.get('id');
        var isTagged = $(e.target).attr('data-is-tagged');

        if (!isTagged){
          service
          .setTagOnGist(tagId, gistId)
          .done(function(data){
            var tagNames = self.model.get('tags');
            tagNames.push(tagName);
            self.model.set('tags', tagNames);
            
            self.tags.reset(data);
            postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());
            
            // force registering hover event on tag item in tag popup
            self.onTagButtonClick();  
          });
        }else{
          service
          .deleteTagOnGist(tagId, gistId)
          .done(function(data){
            var tagNames = self.model.get('tags');
            self.model.set('tags', _.without(tagNames, tagName));

            self.tags.reset(data);
            postalWrapper.publish(constants.TAG_CHANGED, self.tags.toJSON());
            
            // force registering hover event on tag item in tag popup
            self.onTagButtonClick();  
          });
        }
      },

      star: function(e){
        var self = this;
        $('.btn-star .icon-star').addClass('icon-spin star-spin');
        if (self.model.get('is_starred')){
          service.deleteStar(this.model.get('id')).done(function(data){
            self.model.set('is_starred', false);
            self.showStarActionMessage(false);
            postalWrapper.publish(constants.GIST_STAR_CHANGED, self.model.toJSON());    
          }).always(function(){
            $('.btn-star .icon-star').removeClass('icon-spin star-spin');
          }); 
        }else{
          service.setStar(this.model.get('id')).done(function(data){
            self.model.set('is_starred', true);
            self.showStarActionMessage(true);
            postalWrapper.publish(constants.GIST_STAR_CHANGED, self.model.toJSON());    
          }).always(function(){
            $('.btn-star .icon-star').removeClass('icon-spin star-spin');
          }); 
        }           
      },

      showStarActionMessage: function(isStarred){
        if (isStarred){
          $('.starred-success').text('Starred Successfully').removeClass('starred-success-hide starred-success-show').addClass('starred-success-show');
          setTimeout(function(){
            $('.starred-success').removeClass('starred-success-hide starred-success-show').addClass('starred-success-hide');
          }, 2000);
        }else{
          $('.starred-success').text('Unstarred Successfully').removeClass('starred-success-hide starred-success-show').addClass('starred-success-show');
          setTimeout(function(){
            $('.starred-success').removeClass('starred-success-hide starred-success-show').addClass('starred-success-hide');
          }, 2000);
        }       
      },

      onBtnCommentClick: function(e){
        var showComments = true;

        e.preventDefault();
        if($('.comments-wrapper').css('right') == '-300px'){
          $('.files-wrapper').css('right', '300px');
          $('.comments-wrapper').css('right','0px');    
          setTimeout(function(){
            $('#comment-input').focus();
          },300);   
          showComments = true;
        }else{
          $('.files-wrapper').css('right', '0px');
          $('.comments-wrapper').css('right','-300px');
          showComments = false;
        }

        setTimeout(function(){
          $('.files-wrapper').getNiceScroll().resize(); 
        },300);

        store.set(constants.SHOW_COMMENTS, showComments);
      },

      onReloadClick: function(e){
        postalWrapper.publish(constants.GIST_ITEM_RELOAD);
      },
      
      onRoomCreated : function(e){
        var self = this;
        global.socket.emit('addroom', self.model.get('id'));
        self.router.navigate('chat', {trigger: true});
        
        postalWrapper.publish(constants.CHAT_CREATE_ROOM, self.model.toJSON());
      },

      onItemSelected : function(gistItem){
        console.log('onSelected');
        console.log(gistItem);

        if(gistItem.user.id === global.user.id){
          $('.btn-delete-gist').show();
        }else{
          $('.btn-delete-gist').hide();
        }


        this.model = new GistItem(gistItem);
        if (gistItem && gistItem.comments > 0){
          $('.comments-badge').text(gistItem.comments).show();
        }else{
          $('.comments-badge').text('').hide();
        }

        // force refreshing tag popup contents
        this.onTagCollectionChange();
      },

      onCommentDeleted: function(commentId){
        var self = this;
        if (self.model && self.model.get('comments') - 1 > 0){
          self.model.set('comments', self.model.get('comments') - 1);
          $('.comments-badge').text(self.model.get('comments')).show();
        }else{
          self.model.set('comments', 0);
          $('.comments-badge').text('').hide();
        } 
      },

      onCommentAdded:  function(comment){
        var self = this;
        if (self.model && self.model.get('comments') > 0){
          self.model.set('comments', self.model.get('comments') + 1);
          $('.comments-badge').text(self.model.get('comments')).show();
        }else{
          self.model.set('comments', 1);
          $('.comments-badge').text(self.model.get('comments')).show();
        } 
      },

      loading: function(showSpinner, el){
        if (showSpinner){
          var target = $(el).parents()[0];
          this.spinner.spin(target);
        }else{          
          this.spinner.stop();          
        }
      },

      shareWo : function(e) {
        e.preventDefault();
        var self = this;

        $('#btnGistShare').click(function(){
          $.fancybox.close(true);
          
          var users = $('#sharedUsers').val();
          $('#sharedUsers').val('');

          service
          .setShared(self.model.get('id'), users)
          .done(function(data){
            $('.starred-success').css('left', '140px');
            $('.starred-success').text('Shared Successfully').removeClass('starred-success-hide starred-success-show').addClass('starred-success-show');
            setTimeout(function(){
              $('.starred-success').removeClass('starred-success-hide starred-success-show').addClass('starred-success-hide');
              setTimeout(function() {
                $('.starred-success').css('left', '-40px');
              }, 1000);
            }, 2000);


          });
        });

        $.fancybox($('#share-input-popup'), {
          fitToView : true,
          autoSize  : true,
          closeClick  : false,
          openEffect  : 'none',
          closeEffect : 'none',
          afterClose : function() {
            $('#btnGistShare').unbind('click');
          },
          afterShow : function() {
            $('#sharedUsers').focus();
          }
        });

        this.ui.btnShare.popover('hide');
      },
      
      shareFB : function(e){
        e.preventDefault();
        var gistUrl = this.model.get('html_url');
        var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(gistUrl);
        var title = 'GistCamp';
        this.popupWindow(url, title, '626', '436');
        this.ui.btnShare.popover('hide');
      },

      shareTW : function(e){
        e.preventDefault();
        var gistUrl = this.model.get('html_url');
        var url = 'https://twitter.com/intent/tweet?via=gistcamp&url=' + encodeURIComponent(gistUrl);
        var title = 'GistCamp';
        this.popupWindow(url, title, '473', '258'); 
        this.ui.btnShare.popover('hide');
      },

      shareGg : function(e){
        e.preventDefault();
        var gistUrl = this.model.get('html_url');
        var url = 'https://plus.google.com/share?url=' + encodeURIComponent(gistUrl);
        var title = 'GistCamp';
        this.popupWindow(url, title, '473', '216'); 
        this.ui.btnShare.popover('hide');
      },

      shareLnk : function(e){
        e.preventDefault();
        var gistUrl = this.model.get('html_url');
        var url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(gistUrl);
        var title = 'GistCamp';
        this.popupWindow(url, title, '626', '496'); 
        this.ui.btnShare.popover('hide'); 
      },

      sharePocket : function(e){
        e.preventDefault();
        var gistUrl = this.model.get('html_url');
        var description = this.model.get('description');
        var url = 'https://getpocket.com/save?url=' + encodeURIComponent(gistUrl) + "&title=" + encodeURIComponent(description);
        var title = 'GistCamp';
        this.popupWindow(url, title, '550', '320'); 
        this.ui.btnShare.popover('hide');   
      },

      shareEverNote : function(e){
        e.preventDefault();
        var self = this;

        service.isEvernoteAuthenticated().done(function(result){
          if (result.authenticated){
            self.loading(true, e.target);
            service.saveNote(self.model.get('id')).done(function(result){
              $(e.target).siblings('.saved').addClass('saved-show');
              setTimeout(function(){
                $(e.target).siblings('.saved').removeClass('saved-show');
              }, 3000);
            }).always(function(){
              self.loading(false);
            });
          }else{
            var url = '/auth/evernote?gist_id=' + self.model.get('id');
            var title = 'GistCamp';
            self.popupWindow(url, title, '626', '449'); 
            self.ui.btnShare.popover('hide');     
          }
        });
        
      },

      popupWindow: function(url, title, w, h){
        var left, top, newWindow, dualScreenLeft, dualScreenTop;
        var win = window;
        dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
        top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
        newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        if(newWindow == null || typeof(newWindow) == 'undefined'){
          alert('Please, turn off your pop-up blocker for the GISTCAMP');
        }

        if (window.focus) {
          newWindow.focus();
        }
      }, 

      onClose: function(){
        this.subscription.unsubscribe();
        this.subscriptionDeleteComment.unsubscribe();
        this.subscriptionAddComment.unsubscribe();
        this.subscriptionStar.unsubscribe();
      },

      onDeleteGist : function(){
        var conf = confirm("Do you want to delete this Gist?");

        util.loadSpinner(true);

        if(conf == true){
          this.model.destroy()
          .done(function(data){
            document.location.reload(true);
          })
          .always(function(){
            util.loadSpinner(false);
          });
        }else{
          util.loadSpinner(false);
        }
      }
    })
;


  // note that returning instance of FooterView so that only one instance will be created 
  // in terms of 'shellview, topview, footerview', we do not need multiple instances of them through the application
  return new FooterView;

});