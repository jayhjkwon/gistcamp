define(function(require){
  var
    $           = require('jquery'),
    _           = require('underscore'),
    Marionette  = require('marionette'),
    Application = require('application'),
    constants   = require('constants'),   
    nicescroll  = require('nicescroll'),
    bootstrap   = require('bootstrap'),
    friendsSearchContainerTemplate = require('hbs!templates/friends/friendsSearchContainerTemplate'),
    
    FriendsSearchContainerView = Marionette.Layout.extend({
      
      template : friendsSearchContainerTemplate,

      initialize: function(menu){
      },

      regions : {
        followings : '.follwings',
        followers  : '.followers'
      }
    })
  ;

  return friendsSearchContainerView;
});