define(function(require){
	var 
		postal = require('postal'),
		channel = postal.channel(),

		pub = function(topic, data){
			channel.publish(topic, data);
		},

		sub = function(topic, callback){
			channel.subscribe(topic, callback);
		}
	;

	return {
		pub : pub,
		sub : sub
	};
});