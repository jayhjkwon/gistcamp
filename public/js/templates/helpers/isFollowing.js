define(function(require){
	var 
		Handlebars = require('handlebars'),
		_          = require('underscore'),
		global     = require('global')
	;

	Handlebars.registerHelper('isFollowing', function(user, options){
		if (user.id === global.user.id){
			return '';
		}else if (user.is_following_this_user){
			return '<button data-loading-text="..." class="btn btn-danger follow-user">Unfollow</button>';
		}else{
			return '<button data-loading-text="..." class="btn btn-danger follow-user">Follow</button>';
		}
	});
});