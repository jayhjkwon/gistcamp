var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async')
;
var accessToken = '2fdd28703ec694d5d39084ca424a6466510f2c7d';
var cacheSeconds = 60 * 60 * 1 // 1 hour	
var cacheEnabled = true;			

var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'oauth',
	token: accessToken
});

var sendData = function(data, res){
	res.send({
		data: data, 
		hasNextPage: github.hasNextPage(data),
		linkHeader: data.meta.link
	});
};


var getNextPage = function(linkHeader, res){
	github.getNextPage(linkHeader,
		function(err, data){		
			sendData(data, res);			
		}
	);		
};

/*var setFileContent = function(file, callback){
	request.get(file.raw_url, function(error, response, body){	
		if (file.language && file.language.toLowerCase() === 'markdown'){
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

var handleGist = function(gist, callback){
	var files = _.values(gist.files);
	async.each(files, setFileContent, function(error, result){
		callback(null, gist);
	});
};
*/

exports.getPublicGists = function(req, res){
	var self = this;
	console.log('getPublicGists');
	var linkHeader = req.param('linkHeader');	

	var a = moment();

	if (!linkHeader){
		github.gists.public({per_page: 10},
			function(err, data){		
				if (data) {
					sendData(data, res);
				}
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
		request.get({
			url: file.raw_url + '?access_token=' + accessToken,
			timeout: 5000
		}, function(error, response, body){	
			/*if (file.language && file.language.toLowerCase() === 'markdown'){
				// github.markdown.render({text:body, mode:'markdown'}, function(err, data){
				// 	if (data && data.data) {
				// 		file.file_content = data.data;	
				// 		file.isMarkdown = true;	
				// 	}
				// 	callback(null, file);
				// });
				file.file_content = markdown.toHTML(body);
				file.isMarkdown = true;
				callback(null, file);
			}else{
				file.file_content = body;
				callback(null, file);
			}*/			
			file.file_content = body;
			callback(null, file);
		});
	};

	var sendFiles = function(error, result){
		if (cacheEnabled){
			res.set({
			  // 'Cache-Control': 'public, max-age=' + cacheSeconds,
			});
		}
		res.send(filesInfo);
	};

	async.each(filesInfo, setFileContent, sendFiles);
};

exports.getRawFile = function(req, res){
	var rawUrl = req.param('file');
	var isMarkdown = req.param('isMarkdown');
	
	// var a = moment();
	var sendFileContent = function(body){
		if (cacheEnabled){
			res.set({
			  'Cache-Control': 'public, max-age=' + cacheSeconds,
			});
		}
		res.send(body);
	};
	
	request.get({
		url: rawUrl + '?access_token=' + accessToken,
		timeout: 5000
	}, function(error, response, body){	
		/*if (isMarkdown){
			// github.markdown.render({text:body, mode:'markdown'}, function(err, data){
			// 	if (data && data.data) 
			// 		sendFileContent(data.data);
			// });
			sendFileContent(markdown.toHTML(body));
		}else{
			sendFileContent(body);
		}*/

		sendFileContent(body);

		// var b = moment();
		// console.log('time: ' + a.diff(b));
	});
};

exports.getComments = function(req, res){
	var gistId = req.params.gistId;
	var comments = [];

	// TODO : apply cache using etag or last-modified for avoiding rate-limit
	var setUserName = function(comment, callback){
		var url = config.options.githubHost + '/users/' + comment.user.login + '?access_token=' + accessToken; 
		request.get({url:url}, function(err, response, data){
			if(data){
				var user = JSON.parse(data);
				comment.user.user_name = user.name;
			}
			callback(null, comment);
		});
	};

	request.get({
		url: config.options.githubHost + '/gists/' + gistId + '/comments?access_token=' + accessToken
	},
		function(error, response, body){
		if (body){
			comments = JSON.parse(body);
			/*async.each(comments, setUserName, function(error, result){
				if (cacheEnabled){
					res.set({
					  'Cache-Control': 'public, max-age=' + cacheSeconds
					});
				}
				res.send(comments);
			});*/
			if (cacheEnabled){
				res.set({
				  'Cache-Control': 'public, max-age=' + cacheSeconds
				});
			}
			res.send(comments);
		}else{
			res.send(comments);
		}		
	});
};

exports.createComment = function(req, res){
	var gistId = req.params.gistId;
	var commentText = req.param('commentText');

	var setUserName = function(comment, callback){
		var url = config.options.githubHost + '/users/' + comment.user.login + '?access_token=' + accessToken; 
		request.get(url, function(err, data){
			if (data.body){
				var user = JSON.parse(data.body);
				comment.user.user_name = user.name;
			}
			callback(null, comments);
		});
	};
	
	request.post({
		uri: config.options.githubHost + '/gists/' + gistId + '/comments?access_token=' + accessToken, 
		body: JSON.stringify({body: commentText})
	},
		function(error, response, body){
			//get user name
			var comment = JSON.parse(body);
			var url = config.options.githubHost + '/users/' + comment.user.login + '?access_token=' + accessToken; 
			request.get(url, function(err, data){
				var user = JSON.parse(data.body);
				comment.user.user_name = user.name;
				res.send(comment);
			});		
		}		
	);	
};


/*
	1. get friends (following, follower)
	2. get recent gists of each friend (get only first page)
	3. sort all gists by date 
	4. send data
*/

exports.getFriendsGist = function(req, res){
	var gists = [];
	var followings = [];
	var gistsFollower = [];
	var gistsFollowing = [];

	// get people's gists who I follow
	var getGistsFollowing = function(user, callback){
		github.gists.getFromUser({user: user.login, per_page: 5}, 
			function(err, data){		
				if (data) {
					console.log('getGistsFollowing counts = ' + data.length);
					_.each(data, function(d){
						gistsFollowing.push(d);
					});					
				}
				callback(null, gistsFollowing);
			}
		);	
	};

	// get people's gists who follow me
	var getGistsFollower = function(user, callback){
		github.gists.getFromUser({user: user.login, per_page: 5}, 
			function(err, data){		
				if (data) {
					console.log('getGistsFollower counts = ' + data.length);
					_.each(data, function(d){
						gistsFollower.push(d);
					});					
				}
				callback(null, gistsFollower);
			}
		);	
	};

	var sendGists = function(){
		var gists = _.union(gistsFollower, gistsFollowing);
		var sortedGists = _.sortBy(gists, function(gist){
			return gist.updated_at;
		}).reverse();

		res.send({data: sortedGists});
	};

	// get gists in parallel, send gists after getting all
	async.parallel([
		function(callback){
			github.user.getFollowers({user: 'RayKwon'}, function(err, data){
				if (data) {
					console.log('github.user.getFollowers counts = ' + data.length);
					async.each(data, getGistsFollower, function(error, result){
						callback(null, gistsFollower);
					});
				}else{
					callback(null, []);
				}
			});
		},
		
		function(callback){
			github.user.getFollowing({}, function(err, data){
				if (data){
					console.log('github.user.getFollowing counts = ' + data.length);
					async.each(data, getGistsFollowing, function(error, result){
						callback(null, gistsFollowing);
					});
				}else{
					callback(null, []);
				}
			});
		}
	], function(error, results){
		sendGists();
	});
};
























