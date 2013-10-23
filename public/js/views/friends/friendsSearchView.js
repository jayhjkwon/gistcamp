define(function(require){
  var
    $                      = require('jquery'),
    _                      = require('underscore'),
    Marionette             = require('marionette'),
    Application            = require('application'),
    constants              = require('constants'),   
    nicescroll             = require('nicescroll'),
    bootstrap              = require('bootstrap'),
    FriendsItemView        = require('./friendsItemView'),
    friendsSearchTemplate  = require('hbs!templates/friends/friendsSearchTemplate'),
    FriendsItemList        = require('models/friendsItemList'), 
    Spinner                = require('spin'),
    
    FriendsSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemViewContainer : 'div.friends-list',
      itemView : FriendsItemView,
      className: 'friends-search-view',
      mode: '',

      initialize: function(){     
        _.bindAll(this, 'getFriends', 'getFollowing', 'getFollowers', 'onScroll', 'loadMore', 'loading');
        this.isLoading = false;
        this.collection = new FriendsItemList;  
        this.spinner = new Spinner();
      },

      events: {
        'click .loadmore .btn' : 'loadMore'
      },

      onDomRefresh: function(){
      },

      onRender : function(){
        $('.friends-search-container').niceScroll({cursorcolor: '#eee'});
        $('.friends-search-container').off('scroll').on('scroll', this.onScroll);
      },

      getFriends: function(){
        var self = this;

        if(this.isLoading) return;
        this.isLoading = true;

        setTimeout(function(){
          self.collection.add([{}, {}, {}, {}]);
          self.isLoading = false;
          self.loading(false);        
        }, 2000);
      },

      getFollowing: function(){
        this.mode = 'following';
        this.getFriends();
        this.collection.add([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
      },

      getFollowers: function(){
        this.mode = 'followers';
        this.getFriends();
        this.collection.add([{}, {}, {}, {}, {}, {}, {}]);
      },

      onScroll : function(){
        var w = $('.friends-search-container');
        console.log(w.scrollTop() + ', ' + w.height() + ', ' + (parseInt(w.scrollTop()) + parseInt(w.height())) + ', ' + $('.friends-search-view').height());
        if(w.scrollTop() + w.height() >= $('.friends-search-view').height()) {
          this.loadMore();
        }
      },
      
      loadMore: function(){
        console.log('loadMore');
        if(this.lastPage) return;
        this.loading(true);
        this.getFriends();
      },

      loading: function(showSpinner){
        if (showSpinner){
          this.$el.find('.loadmore').append('<div style="height:100px;" class="loading"></div>');
          var target = this.$el.find('.loadmore .loading')[0];
          this.spinner.spin(target);
        }else{          
          this.spinner.stop();          
          this.$el.find('.loading').remove(); 
        }
      }
    })
  ;

  return FriendsSearchView;
});