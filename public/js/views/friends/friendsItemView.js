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
        _.bindAll(this, 'minus', 'viewClicked', 'selectThisView', 'setSelectedClass');
      },

      events: {
        'click .minus' : 'minus',
        'click' : 'viewClicked'
      },

      viewClicked: function(e){
        if(window.location.hash.indexOf('#friends/gists') > -1){
          window.location.hash='friends/gists/' + this.model.get('login');          
        }
        this.setSelectedClass();
      },

      selectThisView: function(){
        this.setSelectedClass();
        postalWrapper.publish(constants.WATCH_ITEM_CLICK, this.model);
      },

      setSelectedClass: function(){
        $('.friends-item-container .row-fluid').removeClass('selected');
        this.$el.addClass('selected');
      },

      minus: function(e){
        e.stopImmediatePropagation();
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