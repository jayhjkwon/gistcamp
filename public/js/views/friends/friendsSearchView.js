define(function(require){
  var
    $                      = require('jquery'),
    _                      = require('underscore'),
    Marionette             = require('marionette'),
    Application            = require('application'),
    constants              = require('constants'),   
    nicescroll             = require('nicescroll'),
    bootstrap              = require('bootstrap'),
    friendsSearchTemplate  = require('hbs!templates/friends/friendsSearchTemplate')
    
    FriendsSearchView = Marionette.CompositeView.extend({
      template : friendsSearchTemplate,
      itemView : FriendsItemView,
      itemViewContainer : 'div.friends-list'  
    })
  ;

  return FriendsSearchView;
});