var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'basic',
	username: 'RayKwon',
	password: 'havana24'
});

exports.getGistList = function(req, res){
	github.gists.getAll({
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

exports.getGistListByUser = function(req, res){
	github.gists.getFromUser({
		user: req.param('user') || 'mikedeboertest',
		page: req.param('page') || 1,
		per_page: 30
	},
	function(err, data){
		console.log('getGistListByUser invoked in server');
		console.dir(data.pop());
		var gist = data.pop();
		res.send({
			data: gist, 
			hasNextPage: github.hasNextPage(data)
		});
	});
};
