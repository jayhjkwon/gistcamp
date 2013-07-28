define(function(require){
	var 
		constants = require('constants'),		
		postal    = require('postal'),

		publish = function(topic, data) {
		  return postal.publish({
		    channel: constants.channels.APPLICATION,
		    topic  : topic,
		    data   : data
		  });
		},

		subscribe = function(topic, callback) {
		  return postal.subscribe({
		    channel : constants.channels.APPLICATION,
		    topic   : topic,
		    callback: callback
		  });
		}
	;

	return {
		publish   : publish,
		subscribe : subscribe
	};
});

