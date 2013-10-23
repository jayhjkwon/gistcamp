define(function(require){
  var
    $               = require('jquery'),
    _               = require('underscore'),
    Backbone        = require('backbone'),
    Marionette      = require('marionette'),
    Application     = require('application'),
    constants       = require('constants'),
    postalWrapper   = require('postalWrapper'),
    friendsCardTemplate= require('hbs!templates/friends/friendsCardTemplate'),
    tipsy           = require('tipsy'),
    
    FriendsCardView = Marionette.ItemView.extend({
      template : friendsCardTemplate,
      className : 'row-fluid',

      initialize : function(){
        _.bindAll(this, 'plus');
      },

      events: {
        'click .plus' : 'plus'
      },

      plus: function(e){
        Application.execute('view:remove', this.model);
        this.close();
      },

      onRender: function(){
        $('.plus').tipsy({gravity: 's', fade: true});
        $('.minus').tipsy({gravity: 's', fade: true});
      }
    })
  ;

  return FriendsCardView;
});