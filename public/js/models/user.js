define(function(require){
	var
		Backbone  = require('backbone'),
		constants = require('constants'), 
		
		User = Backbone.Model.extend({
			initialize: function(props){
				this.mode = props ? props.mode || '' : '';
			},

			url	: function(){ 
				switch (this.mode){
					case constants.USER_AUTH :
						return '/api/user/auth';	
					default :
						return '';	
				}
			}
		})
	;

	return User;
});