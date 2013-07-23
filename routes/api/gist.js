var 
	GitHubApi = require('github'),
	config   = require('../../infra/config')
;

var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'oauth',
	token: '7a42d72331c2d19a1dc6a47b01c227d267d71e36'
});

var getNextPage = function(linkHeader, res){
	github.getNextPage(linkHeader,
		function(err, data){		
			// console.dir(data);
			res.send({
				data: data, 
				hasNextPage: github.hasNextPage(data),
				linkHeader: data.meta.link
			});
		}
	);		
};

var sendData = function(data, res){
	// console.dir(data);				
	res.send({
		data: data, 
		hasNextPage: github.hasNextPage(data),
		linkHeader: data.meta.link
	});
};

exports.getPublicGists = function(req, res){
	var self = this;
	console.log('getPublicGists');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.public({},
			function(err, data){		
				if (data) sendData(data, res);
			}
		);
	}else{
		getNextPage(linkHeader, res);
	}
};

exports.getGistListByUser = function(req, res){
	var self = this;	
	console.log('getGistListByUser');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.getFromUser({
			user: req.param('user') || 'RayKwon', 
			per_page: config.options.perPage || 30
		}, 
			function(err, data){		
				if (data) sendData(data, res);
			}
		);
	}else{
		getNextPage(linkHeader, res);
	}
};

exports.getStarredGists = function(req, res){
	var self = this;	
	console.log('getStarredGists');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.starred({}, 
			function(err, data){		
				if (data) sendData(data, res);
			}
		);
	}else{
		getNextPage(linkHeader, res);
	}
};

// getFollowers : people who follows me
// getFollowingFromUser, getFollowing : people who I follow
// github.user.getFollowers({user:'RayKwon'}, function(err, data){
// 	console.log('getFollowUser');
// 	console.dir(data);
// });