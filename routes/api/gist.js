var 
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async'),
    service   = require('../../infra/service'),
    util      = require('../../infra/util'),
    User      = require('../../models/user'),
    mongoose  = require('mongoose')
;
var cacheSeconds = 60 * 60 * 1 // 1 hour	
var cacheEnabled = true;			

var sendData = function(data, req, res){
	var github = service.getGitHubApi(req);

	async.series([
		function(callback){
			getTagsByGistId(req, data, callback);
		},

		function(callback){
			res.send({
				data: data, 
				hasNextPage: github.hasNextPage(data),
				linkHeader: data.meta ? data.meta.link ? data.meta.link : null : null
			});		
			callback(null);
		}
	]);
};

var getNextPage = function(linkHeader, req, res){
	var github = service.getGitHubApi(req);

	github.getNextPage(linkHeader,
		function(err, data){		
			if (data) sendData(data, req, res);			
		}
	);		
};

var getTagsByGistId = function(req, gists, cb){
	var userId = service.getUserId(req);
	var userTags = [];

	async.series([
		function(callback){
			User.find({'id':userId}).select('tags.tag_name tags.gists.gist_id').lean().exec(function(error, docs){
				userTags = docs[0].tags;
				callback(null);
			});
		},

		function(callback){
			async.each(
				gists, 
				function(gist, cb){					
					var tagNames = _.filter(userTags, function(tag){
						var isIn = _.where(tag.gists, {'gist_id':gist.id});
						return isIn.length;
					});

					gist.tags = _.pluck(tagNames, 'tag_name');

					cb(null);				
				}, 
				function(){
					callback(null);
				}
			);	
		},

		function(callback){
			cb(null);
		}
	]);
};

exports.getPublicGists = function(req, res){
	var self = this;	
	var github = service.getGitHubApi(req);
	
	console.log('getPublicGists');
	var linkHeader = req.param('linkHeader');	

	if (!linkHeader){
		github.gists.public({},
			function(err, data){		
				if (data) {
					sendData(data, req, res);
				}
			}
		);
	}else{
		getNextPage(linkHeader, req, res);
	}
};

exports.getGistListByUser = function(req, res){
	var self = this;	
	var github = service.getGitHubApi(req);
	
	console.log('getGistListByUser');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.getFromUser({
			user: req.param('login_name'), 
			per_page: config.options.perPage || 30
		}, 
			function(err, data){		
				if (data) sendData(data, req, res);
			}
		);
	}else{
		getNextPage(linkHeader, req, res);
	}
};

exports.getGistById = function(req, res){
	var self = this;	
	
	var gistId = req.param('gistId');
	var github = service.getGitHubApi(req);
	
	console.log('getGistById : ' + gistId);

	github.gists.get({id : gistId}, 
		function(err, data){	
			console.log(err);
			console.log(data);

			if (data) sendData(data, req, res);
		}
	);
};

exports.getStarredGists = function(req, res){
	var self = this;
	var github = service.getGitHubApi(req);
		
	console.log('getStarredGists');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.starred({per_page: config.options.perPage || 30}, 
			function(err, data){		
				if (data) sendData(data, req, res);
			}
		);
	}else{
		getNextPage(linkHeader, req, res);
	}
};

exports.getGistListByTag = function(req, res){
	var tagId = req.params.tag_id;
	var userId = service.getUserId(req);
	var gistList = [];
	var github = service.getGitHubApi(req);

	var getGistById = function(gistId, callback){
		github.gists.get({id : gistId}, 
			function(err, data){	
				gistList.push(data);
				callback(null, data);
			}
		);
	};

	User
	.where('id', userId)
	.where('tags._id', tagId)
	.select('tags.$')
	.lean()
	.exec(function(err, docs){
		var gists = [];
		if (docs && docs[0].tags && docs[0].tags[0].gists){
			var gists = docs[0].tags[0].gists;
			var gistIds = _.pluck(gists, 'gist_id');
			async.each(gistIds, getGistById, function(error, result){
				// res.send({data: gistList});
				async.series([
					function(callback){
						getTagsByGistId(req, gistList, callback);
					},
					function(callback){
						res.send({data: gistList});
						callback(null);
					}
				]);
			});
		}else{
			res.send({data: gistList});
		}
	});
};

exports.getRawFiles = function(req, res){
	var filesInfo = req.param('files');
	var accessToken = service.getAccessToken(req);

	var setFileContent = function(file, callback){
		request.get({
			url: file.raw_url + '?access_token=' + accessToken,
			timeout: 5000
		}, function(error, response, body){	
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
	var accessToken = service.getAccessToken(req);
	
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
		sendFileContent(body);
	});
};

exports.getComments = function(req, res){
	// var a = moment();
	var gistId = req.params.gistId;
	var comments = [];
	var accessToken = service.getAccessToken(req);

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
			res.send(body);			
	});
};

exports.createComment = function(req, res){
	var gistId = req.params.gistId;
	var commentText = req.param('commentText');
	var accessToken = service.getAccessToken(req);

	request.post({
		url: config.options.githubHost + '/gists/' + gistId + '/comments?access_token=' + accessToken, 
		body: JSON.stringify({body: commentText})
	},
		function(error, response, body){
			res.send(body);
		}		
	);	
};

exports.editComment = function(req, res){
	var id = req.params.id;
	var gistId = req.params.gistId;
	var commentText = req.param('commentText');
	var accessToken = service.getAccessToken(req);

	request.patch({
		url: config.options.githubHost + '/gists/' + gistId + '/comments/' + id + '?access_token=' + accessToken, 
		body: JSON.stringify({body: commentText})
	},
		function(error, response, body){
			res.send(body);
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
	var github = service.getGitHubApi(req);
	var loginName = service.getLoginName(req);

	// get people's gists who I follow
	var getGistsFollowing = function(user, callback){
		github.gists.getFromUser({user: user.login, per_page: 5}, 
			function(err, data){		
				if (data) {
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
			return gist.created_at;
		}).reverse();

		async.series([
			function(callback){
				getTagsByGistId(req, sortedGists, callback);
			},

			function(callback){
				res.send({data: sortedGists});
				callback(null);
			}
		]);
	};

	// get gists in parallel, send gists after getting all
	async.parallel([
		function(callback){
			github.user.getFollowers({user: loginName}, function(err, data){
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

exports.getTags = function(req, res){
	User.find({id:service.getUserId(req)})
		.select('tags')
		.lean()
		.exec(function(err, docs){
			res.send(docs[0].tags);
		});
};

exports.createTag = function(req, res){
	var tagName = req.param('tagName');
	var gistId  = req.param('gistId');
	var tagUrl  = util.convertToSlug(tagName);
	var tagId;

	var conditions = {id: service.getUserId(req)};
	var update = {
		$push: 
		{
			tags: 
			{
				tag_name:tagName, 
				tag_url:tagUrl, 
				gists: [{gist_id:gistId}]
			}
		}
	};
	var options = {upsert:true};
	User.update(conditions, update, options, function(err, numberAffected, raw){
		User.find({id:service.getUserId(req)})
		.select('tags')
		.lean()
		.exec(function(err, docs){
			res.send(docs[0].tags);
		});
	});
};

exports.editTagGist = function(req, res){
	var tagId = req.params.tag_id;
	var gistId = req.params.gist_id;
	var userId = service.getUserId(req);

	User.find({id:userId}).select('tags').lean().exec(function(err, docs){
		var tags = docs[0].tags;

		var tagCnt = _.find(tags, function(tag){
			return tag._id.toString() === tagId;
		});

		var gistCnt = _.find(tagCnt.gists, function(gist){
			return gist.gist_id === gistId;
		});

		if (gistCnt){
			res.send(tags);
		}else{
			User.update(
				{id:userId, 'tags._id':mongoose.Types.ObjectId(tagId)}, 
				{$push: {'tags.$.gists' : {'gist_id':gistId}}}, 
				function(err, numberAffected, rawResponse){
					User.find({id:userId}).select('tags').lean().exec(function(err, docs){
						res.send(docs[0].tags);
					});					
				}
			);	
		}
	});
};


exports.getGistsByTag = function(req, res){

};

exports.editTag = function(req, res){

};

exports.removeTag = function(req, res){

};

exports.setStar = function(req, res){
	var github = service.getGitHubApi(req);
	var gistId = req.params.gist_id;

	github.gists.star({id:gistId}, function(err, data){		
		res.send(data);
	});	
};


exports.setNewGist = function(req, res){
	
	var github = service.getGitHubApi(req);


}

















