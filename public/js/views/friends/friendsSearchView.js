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
    Friends                = require('models/friends'), 
    Spinner                = require('spin'),
    postalWrapper          = require('postalWrapper'),
    Friend                 = require('models/friend'),
    util                   = require('util'),
    
    FriendsSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemViewContainer: function(){
        return this.$el.find('.friends-list');
      },
      itemView : FriendsCardView,
      className: 'friends-search-view',
      mode: '',

      initialize: function(options){     
        this.mode = options.mode;
        _.bindAll(this, 'addCardView', 'removeCardView', 'onRender', 'onDomRefresh', 'getFriends', 'getFollowing', 'getFollowers', 'onScroll', 'loadMore', 'loading');
        this.isLoading = false;
        this.collection = new Friends();  
        this.spinner = new Spinner();
        this.on('itemview:close', self.removeCardView);
        // this.subscription = postalWrapper.subscribe(constants.REMOVE_FROM_WATCH, this.addCardView);    
      },

      events: {
        'click .loadmore .btn' : 'loadMore'
      },

      // TODO : check user passed in is following or follower then add collection if it matches with 'this.mode'
      addCardView: function(model){
        this.isAddedFromWatch = true;
        this.collection.add(model);
        console.log(this.collection.length);
      },

      removeCardView: function(childView, model){
        this.collection.remove(model);
        console.log(this.collection.length);
      },

      onAfterItemAdded: function(itemView){
        if (this.isAddedFromWatch){
          itemView.$el.hide().show('bounce');
          var list = document.querySelector('.friends-search-container');
          list.scrollTop = list.scrollHeight;
          this.isAddedFromWatch = false;
        }
      },

      onDomRefresh: function(){
      },

      onRender : function(){
        $('.friends-search-container').niceScroll({cursorcolor: '#eee'});
        // $('.friends-search-container').off('scroll').on('scroll', this.onScroll);
      },

      getFriends: function(){
        var self = this;

        if(self.isLoading) return;
        self.isLoading = true;
        self.loading(true);
        // util.loadSpinner(true);

        var friends = new Friends({mode: self.mode});
        // self.collection.fetch({data: {linkHeader: self.linkHeader}})
        friends.fetch({data: {linkHeader: self.linkHeader}})
        .done(function(res){
          if (!self.linkHeader){
            self.collection.set(res.data);
          }else{
            self.collection.add(res.data);
          }
          
          if (res.hasNextPage){
            self.linkHeader = res.linkHeader;
          }else{
            self.lastPage = true;
          }           
        })
        .always(function(){
          self.isLoading = false;
          self.loading(false);
          // util.loadSpinner(false);            
          $('.friends-search-container').getNiceScroll().resize();          
        });
      },

      getFollowing: function(){
        this.getFriends();
      },

      getFollowers: function(){
        this.getFriends();
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
        this.getFriends();
      },

      loading: function(showSpinner){
        if(showSpinner){
          this.$el.find('.loadmore i.icon-spin').addClass('icon-refresh');
        }else{
          this.$el.find('.loadmore i.icon-spin').removeClass('icon-refresh');

        }
      },

      onClose: function(){
        // this.subscription.unsubscribe();
      }
    })
  ;

  return FriendsSearchView;
});