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


/*var 
	_      = require('underscore'),
	github = require('octonode')
;*/

/* for authenticated access */
/*var	client = github.client({
	username: 'RayKwon',
	password: 'userpassword'
});*/

/* public access */
/*var client = github.client();

exports.getGistList = function(req, res){
	var ghgist = client.gist();
	ghgist.list({page:1, per_page:100}, function(err, data){
		res.send(data);
	});	
};*/

