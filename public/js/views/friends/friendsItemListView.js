define(function(require){
  var
    $            = require('jquery'),
    _            = require('underscore'),
    Backbone     = require('backbone'),
    Marionette   = require('marionette'),    
    Handlebars   = require('handlebars'),
    Spinner      = require('spin'),
    NoItemsView  = require('../noItemsView'),
    constants    = require('constants'),
    util         = require('util'),
    async        = require('async'),
    service      = require('service'),
    File         = require('models/file'),
    nicescroll   = require('nicescroll'),
    FriendsItemView = require('./friendsItemView'),
    FriendsItemList = require('models/friendsItemList'),    
    jqueryui     = require('jqueryui'),
    postalWrapper= require('postalWrapper'),    
    
    FriendsItemListView = Marionette.CollectionView.extend({
      className: 'friends-item-container',
      itemView: FriendsItemView,      

      initialize: function(){   
        _.bindAll(this, 'getWatchingList', 'addWatch');
        this.collection = new FriendsItemList;      
        this.subscription = postalWrapper.subscribe(constants.ADD_TO_WATCH, this.addWatch);    
      },

      getWatchingList: function(){
        this.collection.add([{}, {}, {}, {}]);
      },

      addWatch: function(model){
        this.isAddedFromFriends = true;
        this.collection.add(model);
      },

      onAfterItemAdded: function(itemView){
        if (this.isAddedFromFriends){
          itemView.$el.hide().show('bounce');
          var list = document.querySelector('.friends-item-list');
          list.scrollTop = list.scrollHeight;
          this.isAddedFromFriends = false;
        }
      },

      onDomRefresh: function(){
        $('.friends-item-container' ).sortable({
          delay: 100, 
          distance: 15, 
          tolerance: 'pointer',
          revert: 'invalid',
          placeholder: 'placeholder',
          forceHelperSize: true
        });
        $('.friends-item-container' ).disableSelection();
      },

      onRender : function(){
        $('.friends-item-list').niceScroll({cursorcolor: '#eee'});
      },

      onClose: function(){
        this.subscription.unsubscribe();
      }
    })
  ;

  return FriendsItemListView;
});