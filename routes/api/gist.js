var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('underscore'),
	moment    = require('moment'),
    async     = require('async')
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

	var setFileContent = function(file, callback){
		request.get(file.raw_url, function(error, response, body){	
			if (file.language.toLowerCase() === 'markdown'){
				github.markdown.render({text:body}, function(err, data){
					file.file_content = data.data;		
					callback(null, file);
				});
			}else{
				file.file_content = body;
				callback(null, file);
			}			
		});
	};

	var sendFiles = function(error, result){
		var cacheSeconds = 60 * 60 * 1 // 1 hour
		res.set({
		  'Cache-Control': 'public, max-age=' + cacheSeconds,
		  // "ETag" : "054c193559e0eb2adc19e15af2c50361"
		});
		res.send(filesInfo);
	};

	async.each(filesInfo, setFileContent, sendFiles);
};

exports.getRawFile = function(req, res){
	var rawUrl = req.param('file');
	
	var a = moment();
	
	request.get(rawUrl, function(error, response, body){	
		var b = moment();
		console.log('time: ' + a.diff(b));

		res.set({
		  'Cache-Control': 'public, max-age=31536000'
		});
		res.send(body);
		
		var c = moment();
		console.log('time: ' + b.diff(c));
	});
};


// getFollowers : people who follows me
// getFollowingFromUser, getFollowing : people who I follow
// github.user.getFollowers({user:'RayKwon'}, function(err, data){
// 	console.log('getFollowUser');
// 	console.dir(data);
// });