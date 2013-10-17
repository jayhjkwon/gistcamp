define(function(require){
  var
    $            = require('jquery'),
    _            = require('underscore'),
    Backbone     = require('backbone'),
    Marionette   = require('marionette'),    
    Handlebars   = require('handlebars'),
    Spinner      = require('spin'),
    NoItemsView  = require('./NoItemsView'),
    constants    = require('constants'),
    util         = require('util'),
    async        = require('async'),
    service      = require('service'),
    File         = require('models/file'),
    nicescroll   = require('nicescroll'),
    FriendsItemView = require('./friendsItemView'),
    FriendsItemList = require('models/friendsItemList'),
    
    FriendsItemListView = Marionette.CollectionView.extend({
      className: 'friends-item-container',
      itemView: FriendsItemView,
      collection: new FriendsItemList,

      initialize: function(){       
      }
    })
  ;

  return FriendsItemListView;
});