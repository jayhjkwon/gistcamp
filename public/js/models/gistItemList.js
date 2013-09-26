define(function(require){
  var
  Backbone    = require('backbone'),
  constants       = require('constants'),
  GistItem    = require('./gistItem'),
  global          = require('global'),
  GistItemList  = Backbone.Collection.extend({
    model: GistItem,
    initialize: function(props){
      console.log('GistItemList Collection initialized');
      this.gistDataMode = props ? props.gistDataMode || '' : '';
      this.tagId = props ? props.tagId || null : null;
    },
    url : function(){
      var url = '';

      switch (this.gistDataMode){
        case constants.GIST_PUBLIC :
        return '/api/gist/public';  
        case constants.GIST_LIST_BY_USER :
        return '/api/gist/user/' + global.user.login;
        case constants.GIST_STARRED :
        return '/api/gist/starred';
        case constants.GIST_FRIENDS_GISTS :
        return '/api/gist/friends';
        case constants.GIST_TAGGED_GISTS :
        return '/api/gist/tagged/' + this.tagId;
        case constants.GIST_SHARED :
        return '/api/gist/shared/' + global.user.login;
        default :
        return '/api/gist/public';  
      }
    }
  })
  ;

  return GistItemList;
});