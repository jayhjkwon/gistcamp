define(function(require){
  var
    $               = require('jquery'),
    _               = require('underscore'),
    Marionette      = require('marionette'),
    friendsTemplate= require('hbs!templates/friends/friendsTemplate'),
    Application     = require('application'),
    constants       = require('constants'),   
    nicescroll      = require('nicescroll'),
    bootstrap       = require('bootstrap'),
    
    FriendsView = Marionette.Layout.extend({
      template : friendsTemplate,
      className: 'main-content',
      
      initialize: function(){
      },

      regions : {
        friendsItemList : '#friends-item-list',
        friendsSearchContainer : '#friends-search-container'
      }
    })
  ;

  return FriendsView;
});