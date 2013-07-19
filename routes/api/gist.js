var 
	_      = require('underscore'),
	github = require('octonode')
;

/* for authenticated access */
/*var	client = github.client({
	username: 'RayKwon',
	password: 'userpassword'
});*/

/* public access */
var client = github.client();

exports.getGistList = function(req, res){
	var ghgist = client.gist();
	ghgist.list(function(err, data){
		res.send(data);
	});	
};

