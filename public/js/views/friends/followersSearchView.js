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

    FollowersSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemViewContainer : 'div.friends-list',
      itemView : FriendsItemView,
      collection: new FriendsItemList,

      initialize: function(){     
        console.log('followers=' + this.collection.length);
        this.collection.add([{}, {}]);
        console.log('followers=' + this.collection.length);
      }
    })
  ;

  return FollowersSearchView;
});