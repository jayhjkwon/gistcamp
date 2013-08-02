var 
	_         = require('underscore'),
	GitHubApi = require('github')
;


exports.getUser = function(req, res){
	var userId = req.params.id;
	github.authorization.get({id: userId}, function(err, data){
		res.send(data);
	});
};

exports.getAuthUser = function(req, res){

},

