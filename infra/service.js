var 
	GitHubApi = require('github')
;

var github = new GitHubApi({
	version: '3.0.0'
});

exports.getGitHubApi = function(req){
	github.authenticate({
		type: 'oauth',
		token: req.user.access_token
	});

	return github;	
};

// this function is intend to be used after authentication
exports.getAccessToken = function(req){
	return req.user.access_token;
};

exports.getUserId = function(req){
	return req.user.id;
};

// this function is intend to be used after authentication
exports.getLoginName = function(req){
	return req.user.login;
};