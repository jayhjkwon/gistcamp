define(function(require){
  var
  $         = require('jquery'),
  _         = require('underscore'),
  Backbone    = require('backbone'),
  Marionette    = require('marionette'),    
  Handlebars      = require('handlebars'),
  Spinner         = require('spin'),
  GistItemView  = require('./gistItemView'),
  NoItemsView   = require('./NoItemsView'),
  GistItemList  = require('models/gistItemList'),
  constants       = require('constants'),
  util            = require('util'),
  async           = require('async'),
  service         = require('service'),
  File            = require('models/file'),
  nicescroll      = require('nicescroll'),
  postalWrapper   = require('postalWrapper'),
  
  GistItemListView = Marionette.CollectionView.extend({
    className: 'gist-item-container',
    itemView: GistItemView,
    collection: new GistItemList,
    xhrs : [],    

    initialize: function(){       
      var self = this;
      _.bindAll(this, 'getGistList', 'onRender', 'onScroll', 'handleGist', 'setFileContent', 'onClose');
      this.isLoading = false;
      this.xhrs.length = 0;
      this.spinner = new Spinner();
      this.subscribe = postalWrapper.subscribe(constants.WATCH_ITEM_CLICK, function(model){
        self.lastPage = self.linkHeader = null;
        self.abortXHRs();
        self.getGistListByUser(model.get('login'));
      });
    },

    abortXHRs: function(){
      _.each(self.xhrs, function(xhr){
        var s = xhr.state();
        if (s === 'pending') {
            xhr.abort();  // abort ajax requests those are not completed
        }
      });
    },

    getGistList: function(mode, options){
      var self = this;
      var options = options || {};
      
      if (self.isLoading) return;
      self.isLoading = true;
      util.loadSpinner(true);

      var gistItemList = new GistItemList({'gistDataMode': mode, tagId: options.tagId, userId: options.userId });
      gistItemList.fetch({data: {linkHeader: self.linkHeader}})
      .done(function(res){
        if (!self.linkHeader){
          self.collection.set(res.data);
          self.setFirstItemSelected();
        }else{
          self.collection.add(res.data);
        }
        
        if (res.hasNextPage){
          self.linkHeader = res.linkHeader;
        }else{
          self.lastPage = true;
        }           

        async.eachLimit(res.data, 3, self.handleGist, function(error, result){
          // do nothing, because file content is set in setFileContent method
        });
      })
      .always(function(){
        self.isLoading = false;
        $('.gist-list').niceScroll({cursorcolor: '#eee', cursorwidth:'1px'});
        // $('.gist-list').getNiceScroll().resize();
        self.loading(false);
        util.loadSpinner(false);            
      });
    },
    
    handleGist : function(gist, callback){
      var self = this;
      var files = _.values(gist.files);
      async.each(files, self.setFileContent, function(error, result){
        callback(null, gist);
      });
    },      

    setFileContent : function(file, callback){
      var xhr = service.getFileContent(file, callback);
      this.xhrs.push(xhr);
    },

    onClose: function(){
      /*var self = this;
      _.each(self.xhrs, function(xhr){
        var s = xhr.state();
        if (s === 'pending') {
            xhr.abort();  // abort ajax requests those are not completed
          }
      });*/
      this.abortXHRs();
      this.subscribe.unsubscribe();
    },
    
    getSharedGistList:function(){
      this.getGistList(constants.GIST_SHARED);
    },
    getPublicGistList: function(){
      this.getGistList(constants.GIST_PUBLIC);
    },
    getGistListByUser: function(userId){
      this.getGistList(constants.GIST_LIST_BY_USER, {userId: userId});
    },  
    getStarredGistList: function(){
      this.getGistList(constants.GIST_STARRED);
    },
    getFriendsGistList: function(){
      this.getGistList(constants.GIST_FRIENDS_GISTS);
    },    
    getTaggedGistList: function(tagId, tagUrl){
      this.getGistList(constants.GIST_TAGGED_GISTS, {tagId: tagId});
    },
    setFirstItemSelected: function(){
      $('.gist-item').first().trigger('click');
    },        
    onRender : function(){
      $('.gist-list').niceScroll({cursorcolor: '#eee'});
      // register scroll event handler, this shuld be registered after view rendered
      $('.gist-list').off('scroll').on('scroll', this.onScroll);
      
    },
    onScroll : function(){
      var w = $('.gist-list');
      console.log(w.scrollTop() + ', ' + w.height() + ', ' + (parseInt(w.scrollTop()) + parseInt(w.height())) + ', ' + $('.gist-item-container').height());
      if(w.scrollTop() + w.height() >= $('.gist-item-container').height()) {
        this.loadMore();
      }
    },
    loadMore: function(){
      console.log('loadMore');
      if(this.lastPage) return;
      this.loading(true);
      this.getGistList();
    },
    loading: function(showSpinner){
      if (showSpinner){
        $('#gist-item-list').append('<div style="height:100px;" class="loading"></div>');
        var target = $('#gist-item-list .loading')[0];
        this.spinner.spin(target);
      }else{          
        this.spinner.stop();          
        $('.loading').remove(); 
      }
    }
  })
;

return GistItemListView;
});