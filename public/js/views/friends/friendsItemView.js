define(function(require){
  var
    $               = require('jquery'),
    _               = require('underscore'),
    Backbone        = require('backbone'),
    Marionette      = require('marionette'),
    Application     = require('application'),
    constants       = require('constants'),
    postalWrapper   = require('postalWrapper'),
    friendsItemTemplate= require('hbs!templates/friends/friendsItemTemplate'),
    tipsy           = require('tipsy'),
    
    FriendsItemView = Marionette.ItemView.extend({
      template : friendsItemTemplate,
      className : 'row-fluid',

      initialize : function(){
        _.bindAll(this, 'minus');
      },

      events: {
        'click .minus' : 'minus'
      },

      minus: function(){
        this.trigger('close', this.model);  // parent view (friendsItemListView) listen this event
        postalWrapper.publish(constants.REMOVE_FROM_WATCH, this.model);
        this.close();
      },

      onRender: function(){
        $('.plus').tipsy({gravity: 's', fade: true});
        $('.minus').tipsy({gravity: 's', fade: true});
      },

      onClose: function(){
        $('.tipsy').remove();
      }
    })
  ;

  return FriendsItemView;
});