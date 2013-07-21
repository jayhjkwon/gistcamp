var GitHubApi = require('github');

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
		per_page: 10
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
		// user: req.param('user') || 'RayKwon'/*,
		user: "RayKwon",
		page: req.param('page') || 1,
		per_page: 30
	},
	function(err, data){
		console.dir(data);
		res.send({
			data: data, 
			hasNextPage: github.hasNextPage(data)
		});
	});
};
