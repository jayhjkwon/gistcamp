define(function(require){
	var
		Backbone = require('backbone'),
		User = require('./user'),
		
		UserList = Backbone.Collection.extend({
			urlRoot : '/api/users',
			url 	: function(){
						return this.urlRoot;
					},
			model   : User
		})
	;

	return UserList;
});