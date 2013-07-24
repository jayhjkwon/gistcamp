var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('underscore')
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

exports.getRawFiles = function(req, res){
	var filesInfo = req.param('files');
	var isLast = function(file){
		var i = _.indexOf(filesInfo, file);
		
		if (i === filesInfo.length - 1){
			console.dir(filesInfo);
			res.send(filesInfo);
		}		
	};

	/*_.each(filesInfo, function(file){
		request.get(file.raw_url, function(error, response, body){	
			file.file_content = body;
			isLast(file);
		});
	});*/

	for(var i=0, len = filesInfo.length; i<len; i++){
		(function(i){
			request.get(filesInfo[i].raw_url, function(error, response, body){	
			var f = filesInfo[i];
			f.file_content = body;
			if (i === len-1)
				res.send(filesInfo);
			})
		})(i);
	}
};

exports.getRawFile = function(req, res){
	var fileInfo = req.param('file');

	request.get(fileInfo.raw_url, function(error, response, body){	
		fileInfo.file_content = body;
		res.send(fileInfo);
	});
};

// getFollowers : people who follows me
// getFollowingFromUser, getFollowing : people who I follow
// github.user.getFollowers({user:'RayKwon'}, function(err, data){
// 	console.log('getFollowUser');
// 	console.dir(data);
// });