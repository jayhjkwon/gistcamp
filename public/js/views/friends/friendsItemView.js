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
    
    // TODO : 마우스 오버하면 왼쪽 리스트 해당 아이템에 색깔 바꿔줄것
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
        // postalWrapper.publish(constants.REMOVE_FROM_WATCH, this.model);
        this.close();
      },

      onRender: function(){
        $('.plus').tipsy({gravity: 's', fade: true});
        $('.minus').tipsy({gravity: 's', fade: true});
      },

      onClose: function(){
        if ($('.tipsy')) $('.tipsy').remove();
      }
    })
  ;

  return FriendsItemView;
});