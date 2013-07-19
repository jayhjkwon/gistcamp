var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0'
});

/*github.authenticate({
	type: 'basic',
	username: 'user name',
	password: 'user password'
});*/

exports.getGistList = function(req, res){
	github.gists.getAll({
		page: req.param('page') || 1,
		per_page: 30
	},
	function(err, data){
		res.send(data);

		console.log('hasNextPage : ' + github.hasNextPage(data));

		/*if(github.hasNextPage(data)){
			github.getNextPage(data, function(err, data){
				res.send(data);
				console.dir(data);
			});
		}*/
	});
};
