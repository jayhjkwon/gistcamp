var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async'),
    service   = require('../../infra/service'),
    User      = require('../../models/user')
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
	var userId = service.getUserId(req);
	
	github.user.followUser({user:login}, function(err, data){
		User.update({id:userId}, {$addToSet:{followings:login}}, {}, function(err, numberAffected, raw){
			res.send(data);	
		});		
	});
};

exports.unfollow = function(req, res){
	var github = service.getGitHubApi(req);
	var login = req.params.login_id;
	var userId = service.getUserId(req);
	
	github.user.unFollowUser({user:login}, function(err, data){
		User.update({id:userId}, {$pull:{followings:login}}, {}, function(err, numberAffected, raw){
			res.send(data);	
		});		
	});
};

var getAllFollowings = function(github, pageNum, perPage, containerArray, callback){

	github.user.getFollowing({page:pageNum, per_page:perPage}, function(err, data){
		if (data){
			var logins = _.pluck(data, 'login');			
			_.each(logins, function(login){
				containerArray.push(login);
			});
			
			if (github.hasNextPage(data.meta.link)){
				getAllFollowings(github, pageNum+1, perPage, containerArray, callback);
			}else{
				callback(containerArray);
			}
		}else{
			callback(containerArray);
		}
	});
};

exports.getAllFollowings = function(req, res, accessToken, callback){
	var followings = [];
	var github;

	if(accessToken)
		github = service.getGitHubApiByAccessToken(accessToken);
	else
		github = service.getGitHubApi(req);

	getAllFollowings(github, 1, 100, followings, function(result){
		callback(result);
	});
};


