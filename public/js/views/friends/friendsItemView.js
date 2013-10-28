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
    Friend          = require('models/friend'),
    
    // TODO : 마우스 오버하면 왼쪽 리스트 해당 아이템에 색깔 바꿔줄것
    FriendsItemView = Marionette.ItemView.extend({
      template : friendsItemTemplate,
      className : 'row-fluid',

      initialize : function(){
        _.bindAll(this, 'minus', 'viewClicked');
        // this.on('click', this.viewClicked);
      },

      events: {
        'click .minus' : 'minus',
        'click' : 'viewClicked'
      },

      viewClicked: function(e){
        $('.friends-item-container .row-fluid').removeClass('selected');
        this.$el.addClass('selected');
        postalWrapper.publish(constants.WATCH_ITEM_CLICK, this.model);
      },

      minus: function(){
        var self = this;
        var friend = new Friend({mode: 'remove_watch', id: this.model.get('id'), loginId:this.model.get('login')});
        friend.destroy().done(function(data){
          self.trigger('close', self.model);  // parent view (friendsItemListView) listen this event
          // postalWrapper.publish(constants.REMOVE_FROM_WATCH, this.model);
          self.close();
        });
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