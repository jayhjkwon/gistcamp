var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async')
;

var accessToken = '2fdd28703ec694d5d39084ca424a6466510f2c7d';

var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'oauth',
	token: accessToken
});


exports.getAuthUser = function(req, res){
	github.user.get({}, function(err, data){
		res.send(data);
	});
};

