var 
	GitHubApi = require('github'),
	config   = require('../../infra/config')
;


var github = new GitHubApi({
	version: '3.0.0'
});

// github.authenticate({
// 	type: 'basic',
// 	username: 'username',
// 	password: 'password'
// });


exports.getGistList = function(req, res){
	github.gists.getAll({
		page: req.param('page') || 1,
		per_page: config.options.perPage
	},
	function(err, data){
		console.dir(data);
		res.send({
			data: data, 
			hasNextPage: github.hasNextPage(data)
		});
	});
};

exports.getGistListByUser = function(req, res){
	github.gists.getFromUser({
		user: req.param('user') || 'RayKwon',
		page: req.param('page') || 1,
		per_page: config.options.perPage
	},
	function(err, data){
		console.dir(data);
		res.send({
			data: data, 
			hasNextPage: github.hasNextPage(data)
		});
	});
};
