var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0'
});

exports.getGistList = function(req, res){
	github.gists.getAll({
		page: 1,
		per_page: 30
	},
	function(err, data){
		res.send(data);
	});
};
