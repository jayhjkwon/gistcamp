var _ = require('underscore');

var users = [
	{id:1, name:'kwon', address: {city: 'seoul', zip: '150'}},
  	{id:2, name:'lee', address: {city: 'incheon', zip: '240'}}
];	


exports.getUser = function(req, res){
	var filtered = _.find(users, function(d){
		return d.id == req.params.id;
	});
	res.send(filtered);
};

exports.getUserList = function(req, res){
  res.send(users);
};

exports.save = function(req, res){
	
	console.dir(req.body);	// get json type parameters
	if (users.length === 0){
		users.push({id: 1, name: req.body.name });	
		res.send(200, {id: 1});
	}else{
		var user = _.max(users, function(u){
			return u.id;
		});
		users.push({id: user.id + 1, name: req.body.name });
		res.send(200, {id: user.id + 1});
	}
	
};

exports.removeUser = function(req, res){
	var rest = _.reject(users, function(u){
		return u.id == req.params.id;
	});
	users = rest;
	res.send(200, {id: req.params.id});
};
