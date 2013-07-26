define(function(require){
	var
		Backbone		= require('backbone'),
		constants       = require('constants'),
		CommentItem		= require('./commentItem'),
		CommentItemList	= Backbone.Collection.extend({
			model: CommentItem,
			initialize: function(props){
				console.log('CommentItemList Collection initialized');
			},
			url : function(){
				return '/api/gist/comments';	
			}
		})
	;

	return CommentItemList;
});