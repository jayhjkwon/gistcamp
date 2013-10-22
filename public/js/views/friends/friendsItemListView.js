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
    
    FriendsItemListView = Marionette.CollectionView.extend({
      className: 'friends-item-container',
      itemView: FriendsItemView,
      collection: new FriendsItemList,

      initialize: function(){     
        this.collection.add([{}, {}, {}, {}])  ;
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
      }
    })
  ;

  return FriendsItemListView;
});