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
    
    FriendsSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemViewContainer : 'div.friends-list',
      itemView : FriendsItemView,
      mode: '',

      initialize: function(){     
        _.bindAll(this, 'getFollowing', 'getFollowers');
        this.collection = new FriendsItemList;  
      },

      events: {
        'click .loadmore' : 'loadMore'
      },

      onDomRefresh: function(){
      },

      getFollowing: function(){
        this.mode = 'following';
        console.log('following=' + this.collection.length);
        this.collection.add([{test:'test'}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
        console.log('following=' + this.collection.length);
      },

      getFollowers: function(){
        this.mode = 'followers';
        console.log('followers=' + this.collection.length);
        this.collection.add([{}, {}, {}, {}, {}, {}, {}]);
        console.log('followers=' + this.collection.length);
      },

      loadMore: function(e){

      }
    })
  ;

  return FriendsSearchView;
});