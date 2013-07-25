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
			file.file_content = body;
			callback(null, file);
		});
	};

	async.each(filesInfo, setFileContent, function(error, result){
		res.send(filesInfo);
	});
};

/*exports.getRawFile = function(req, res){
	var fileInfo = req.param('file');
	
	var a = moment();
	
	request.get(fileInfo.raw_url, function(error, response, body){	
		var b = moment();
		console.log('time: ' + a.diff(b));

		fileInfo.file_content = body;
		
		res.send(fileInfo);
		
		var c = moment();
		console.log('time: ' + b.diff(c));
	});
};*/

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

/*exports.getRawFile = function(req, res){
	var filePath = req.param('file');
	var filePathArray = filePath.split('/');
	var host = filePathArray[2];
	var path = filePath.substring(23);

	var a = moment();
	
	var options = {
	  host: host,
	  path: path
	};

	var callback = function(response) {
	  var str = '';

	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  response.on('end', function () {
	    res.set({
		  'Cache-Control': 'public, max-age=31536000'
		});
	    res.send(str);
	  });
	}

	https.request(options, callback).end();
};*/


// getFollowers : people who follows me
// getFollowingFromUser, getFollowing : people who I follow
// github.user.getFollowers({user:'RayKwon'}, function(err, data){
// 	console.log('getFollowUser');
// 	console.dir(data);
// });