var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async'),
    service   = require('../../infra/service')
;

exports.getAuthUser = function(req, res){
	var github = service.getGitHubApi(req);
	
	github.user.get({}, function(err, data){
		res.send(data);
	});
};

exports.follow = function(req, res){
	var github = service.getGitHubApi(req);
	var login = req.params.login_id;
	
	github.user.followUser({user:login}, function(err, data){
		res.send(data);
	});
};

exports.unfollow = function(req, res){
	var github = service.getGitHubApi(req);
	var login = req.params.login_id;
	
	github.user.unFollowUser({user:login}, function(err, data){
		res.send(data);
	});
};


