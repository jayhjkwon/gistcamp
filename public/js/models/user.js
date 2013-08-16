define(function(require){
	var
		Backbone  = require('backbone'),
		constants = require('constants'), 
		
		User = Backbone.Model.extend({
			initialize: function(props){
				this.mode = props ? props.mode || null : null;
				this.loginId = props ? props.loginId || null : null;
			},

			url	: function(){ 
				switch (this.mode){
					case constants.USER_AUTH :
						return '/api/user/auth';	
					case constants.USER_FOLLOW :
						return '/api/user/following/' + this.loginId;	
					case constants.USER_UNFOLLOW :
						return '/api/user/following/' + this.loginId;		
					default :
						return '';	
				}
			}
		})
	;

	return User;
});