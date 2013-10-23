define(function(require){
  var
    $                      = require('jquery'),
    _                      = require('underscore'),
    Marionette             = require('marionette'),
    Application            = require('application'),
    constants              = require('constants'),   
    nicescroll             = require('nicescroll'),
    bootstrap              = require('bootstrap'),
    // FriendsItemView        = require('./friendsItemView'),
    FriendsCardView        = require('./friendsCardView'),
    friendsSearchTemplate  = require('hbs!templates/friends/friendsSearchTemplate'),
    FriendsItemList        = require('models/friendsItemList'), 
    Spinner                = require('spin'),
    postalWrapper          = require('postalWrapper'),
    
    FriendsSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemViewContainer: function(){
        return this.$el.find('.friends-list');
      },
      itemView : FriendsCardView,
      className: 'friends-search-view',
      mode: '',

      initialize: function(){     
        var self = this;
        _.bindAll(this, 'removeCardView', 'onRender', 'onDomRefresh', 'getFriends', 'getFollowing', 'getFollowers', 'onScroll', 'loadMore', 'loading');
        this.isLoading = false;
        this.collection = new FriendsItemList;  
        this.spinner = new Spinner();
        this.on('itemview:close', self.removeCardView);
      },

      events: {
        'click .loadmore .btn' : 'loadMore'
      },

      removeCardView: function(childView, model){
        this.collection.remove(model);
        console.log(this.collection.length);
      },

      onDomRefresh: function(){
      },

      onRender : function(){
        $('.friends-search-container').niceScroll({cursorcolor: '#eee'});
        // $('.friends-search-container').off('scroll').on('scroll', this.onScroll);
      },

      getFriends: function(){
        var self = this;

        if(this.isLoading) return;
        this.isLoading = true;

        if(!self.i)
          self.i = 0;
        var max = self.i + 5;
        setTimeout(function(){
          for(self.i; self.i<max; self.i++){
            self.collection.add({id:self.i});  
          }
          
          self.isLoading = false;
          self.loading(false); 
          $('.friends-search-container').getNiceScroll().resize();       
        }, 1000);
      },

      getFollowing: function(){
        this.mode = 'following';
        this.getFriends();
        // this.collection.add([{}, {}, {}, {}]);
      },

      getFollowers: function(){
        this.mode = 'followers';
        this.getFriends();
        // this.collection.add([{}, {}, {}, {}]);
      },

      onScroll : function(){
        var w = $('.friends-search-container');
        console.log(w.scrollTop() + ', ' + w.height() + ', ' + (parseInt(w.scrollTop()) + parseInt(w.height())) + ', ' + $('.friends-search-view').height());
        if((parseInt(w.scrollTop()) + parseInt(w.height())) >= this.$el.find('.friends-search-view').height()) {
          this.loadMore();
        }
      },
      
      loadMore: function(){
        if(this.lastPage) return;
        this.loading(true);
        this.getFriends();
      },

      loading: function(showSpinner){
        /*if (showSpinner){
          this.$el.find('.loadmore').prepend('<div style="height:30px;" class="loading"></div>');
          var target = this.$el.find('.loadmore .loading')[0];
          this.spinner.spin(target);
        }else{          
          this.spinner.stop();          
          this.$el.find('.loading').remove(); 
        }*/

        if(showSpinner){
          this.$el.find('.loadmore i.icon-spin').addClass('icon-refresh');
        }else{
          this.$el.find('.loadmore i.icon-spin').removeClass('icon-refresh');

        }
      }
    })
  ;

  return FriendsSearchView;
});