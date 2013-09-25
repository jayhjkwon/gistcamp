var 
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async'),
    service   = require('../../infra/service'),
    util      = require('../../infra/util'),
    User      = require('../../models/user'),
    ChatContent      = require('../../models/chatContent'),
    SharedGist      = require('../../models/sharedGist'),
    mongoose  = require('mongoose')
;
var cacheSeconds = 60 * 60 * 1 // 1 hour	
var cacheEnabled = true;			

var sendData = function(data, req, res){
	var github = service.getGitHubApi(req);

	async.series([
		function(callback){
			async.parallel([
				function(cb){
					setIsFollowing(req, data, cb);
				},

				function(cb){
					getTagsByGistId(req, data, cb);
				},

				function(cb){
					setIsStarred(req, data, cb);
				}],

				function(err, results){
					callback(null);
				}
			)
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

var setIsStarred = function(req, gists, cb){
	var userId = service.getUserId(req);
	var starredGists = [];

	async.series([
		function(callback){
			User.find({'id':userId}).select('starred_gists').lean().exec(function(error, docs){
				starredGists = docs[0].starred_gists;
				callback(null);
			});
		},

		function(callback){
			async.each(
				gists, 
				function(gist, cb){					
					var exist = _.find(starredGists, function(starredGistId){
						return starredGistId === gist.id;
					});

					if (exist){
						gist.is_starred = true;
					}else{
						gist.is_starred = false;
					}

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

var setIsFollowing = function(req, gists, cb){
	var userId = service.getUserId(req);
	var followings = [];

	async.series(
	[
		function(callback){
			User.find({'id':userId}).select('followings').lean().exec(function(error, docs){
				followings = docs[0].followings;
				callback(null);
			});
		},

		function(callback){
			// if(!gists) callback(null);
			console.dir(gists);

			async.each(
				gists, 
				function(gist, cb){					
					if (!gist) cb(null);
					
					var exist = _.find(followings, function(login){
						return login === gist.user.login;
					});

					if (exist){
						gist.user.is_following_this_user = true;
					}else{
						gist.user.is_following_this_user = false;
					}

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
		github.gists.public({per_page: 10},
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

			if (data) {
				ChatContent
				.where('room_key', gistId)
				.select()
				.lean()
				.exec(function(err, docs){
					if (docs) {
						data.content = docs;
					}
					sendData(data, req, res);
				});
			}
		}
	);
};

exports.getStarredGists = function(req, res){
	var self = this;
	var github = service.getGitHubApi(req);
		
	console.log('getStarredGists');
	var linkHeader = req.param('linkHeader');
	if (!linkHeader){
		github.gists.starred({}, 
			function(err, data){		
				if (data) sendData(data, req, res);
			}
		);
	}else{
		getNextPage(linkHeader, req, res);
	}
};

var addStarredGists = function(gists, containerArray){
	var gistIds = _.pluck(gists, 'id');			
	_.each(gistIds, function(gistId){
		containerArray.push(gistId);
	});
};

var getStarredGistsByPage = function(github, containerArray, isFirstPage, linkHeader, callback){
	if (isFirstPage){
		github.gists.starred({}, function(err, data){
			if (data){
				addStarredGists(data, containerArray);

				if (github.hasNextPage(data)){
					var linkHeader = data.meta ? data.meta.link ? data.meta.link : null : null
					getStarredGistsByPage(github, containerArray, false, linkHeader, callback);
				}else{
					callback(containerArray);
				}
			}else{
				callback(containerArray);
			}
		});
	}else{
		github.getNextPage(linkHeader,
			function(err, data){		
				if (data) {
					addStarredGists(data, containerArray);
					var linkHeader = data.meta ? data.meta.link ? data.meta.link : null : null
					getStarredGistsByPage(github, containerArray, false, linkHeader, callback);
				}else{
					callback(containerArray);		
				}
			}
		);		
	}
	
};

exports.getAllStarredGists = function(req, res, accessToken, callback){
	var allGists = [];
	var github;

	if(accessToken)
		github = service.getGitHubApiByAccessToken(accessToken);
	else
		github = service.getGitHubApi(req);

	getStarredGistsByPage(github, allGists, true, null, function(result){
		callback(result);
	});
};

exports.getSharedGists = function(req, res){

	console.log('getSharedGists');
	
	var login_name = req.params.login_name;
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

	SharedGist 
	.where('target_user_login', login_name) 
	.select() 
	.lean() 
	.exec(function(err, docs){ 
		if (docs) { 
			var gistIds = _.pluck(docs, 'gist_id');
			async.each(gistIds, getGistById, function(error, result){
				async.series([
					function(callback){
						async.parallel([
							function(cb){
								setIsFollowing(req, gistList, cb);
							},

							function(cb){
								getTagsByGistId(req, gistList, cb);
							},

							function(cb){
								setIsStarred(req, gistList, cb);
							}],

							function(err, results){
								callback(null);
							}
						)
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

var trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/gi, "");
};

exports.setSharedGists = function(req, res){

	console.log('setSharedGists');
	
	var gist_id = req.params.gist_id;
	var target_user_login = req.params.users;
	var shared_user_login = service.getLoginName(req);
	
	var splitStr = target_user_login.split(',');
	for(var i = 0; i<splitStr.length; i++)
	{
		// insert to mongodb
		var sharedGist = new SharedGist();
		sharedGist.shared_user_login = shared_user_login;
		sharedGist.target_user_login = trim(splitStr[i]);
		sharedGist.gist_id = gist_id;

		sharedGist.save(function(err) {
		if (err)
		  console.log('sharedGist save error : ' + err);
		});
	}

	res.send({data: "Success"});
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
				async.series([
					function(callback){
						async.parallel([
							function(cb){
								setIsFollowing(req, gistList, cb);
							},

							function(cb){
								getTagsByGistId(req, gistList, cb);
							},

							function(cb){
								setIsStarred(req, gistList, cb);
							}],

							function(err, results){
								callback(null);
							}
						)
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

exports.deleteComment = function(req, res){
	var id = req.params.id;
	var gistId = req.params.gistId;
	var accessToken = service.getAccessToken(req);

	request.del({
		url: config.options.githubHost + '/gists/' + gistId + '/comments/' + id + '?access_token=' + accessToken
	},
		function(error, response, body){
			res.send({});
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
	var github = service.getGitHubApi(req);
	var loginName = service.getLoginName(req);
	var userId = service.getUserId(req);

	var getGistsByUser = function(login, callback){
		github.gists.getFromUser({user: login, per_page: 5}, 
			function(err, data){		
				if (data) {
					async.each(data, 
						function(gist, cb){
							gists.push(gist);
							cb(null);
						}, 
						function(err, result){
							callback(null);
						}
					);									
				}else{
					callback(null);
				}
			}
		);	
	};

	var sendGists = function(){
		var sortedGists = _.sortBy(gists, function(gist){
			return gist.created_at;
		}).reverse();

		async.series([
			function(callback){
				async.parallel([
					function(cb){
						setIsFollowing(req, sortedGists, cb);
					},

					function(cb){
						getTagsByGistId(req, sortedGists, cb);
					},

					function(cb){
						setIsStarred(req, sortedGists, cb);
					}],

					function(err, results){
						callback(null);
					}
				)
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
			// TODO : get followers from the DB not github
			github.user.getFollowers({user: loginName}, function(err, data){
				if (data) {
					async.map(data, 
						function(item, cb){ 
							cb(null, item.login)
						}, 
						function(err, result){
							async.each(result, getGistsByUser, function(error, result){
								callback(null);
							});
						});					
				}else{
					callback(null);
				}
			});
		},
		
		function(callback){
			User.find({'id':userId}).select('followings').lean().exec(function(error, docs){
				var followings = docs[0].followings;
				if(followings.length){
					async.each(followings, getGistsByUser, function(error, result){
						callback(null);
					});
				}else{
					callback(null);
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

exports.setTagOnGist = function(req, res){
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

exports.deleteTagOnGist = function(req, res){
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
			User.update(
				{id:userId, 'tags._id':mongoose.Types.ObjectId(tagId)}, 
				{$pull: {'tags.$.gists' : {'gist_id':gistId}}}, 
				function(err, numberAffected, rawResponse){
					User.find({id:userId}).select('tags').lean().exec(function(err, docs){
						res.send(docs[0].tags);
					});					
				}
			);	
		}else{
			res.send(tags);
		}
	});
};


exports.getGistsByTag = function(req, res){

};

exports.editTag = function(req, res){

};

exports.removeTag = function(req, res){
	var tagId = req.param('id');

	var conditions = {id: service.getUserId(req)};
	var update = {
		$pull: { tags: {'_id':mongoose.Types.ObjectId(tagId) } }
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

exports.setStar = function(req, res){
	var github = service.getGitHubApi(req);
	var gistId = req.params.gist_id;
	var userId = service.getUserId(req);

	github.gists.star({id:gistId}, function(err, data){
		User.update({id:userId}, {$addToSet:{starred_gists:gistId}}, {}, function(err, numberAffected, raw){
			res.send(data);	
		});			
	});	
};

exports.deleteStar = function(req, res){
	var github = service.getGitHubApi(req);
	var gistId = req.params.gist_id;
	var userId = service.getUserId(req);

	github.gists.deleteStar({id:gistId}, function(err, data){		
		User.update({id:userId}, {$pull:{starred_gists:gistId}}, {}, function(err, numberAffected, raw){
			res.send(data);	
		});
	});	
};

exports.createNewgGist = function(req, res){
	var msg = {};
	msg.description = req.body.description;
	msg.public = req.body.public;
	msg.files = req.body.files;

	var github = service.getGitHubApi(req);

	github.gists.create(msg, function(err, data){

		res.send(data);
	});
};

exports.deleteGist = function(req, res){

	var gistId = req.param('id');
	var msg = {};
	msg.id = gistId;
	
	var github = service.getGitHubApi(req);
	github.gists.delete(msg, function(err, data){
		res.send(data);
	});

}

















