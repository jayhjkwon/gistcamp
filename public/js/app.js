require(['jquery', 'underscore', 'application', 'router', 'views/shellView',
	'views/topView', 'views/footerView', 'constants', 'models/user', 'global', 'async',
	'socketio', 'postalWrapper', 'toastr', 'service',
	'bootstrap', 'prettify', 'nicescroll', 'autoGrow', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, constants, User, global, async, 
		socketio, postalWrapper, toastr, service){
	$(function(){
		var el = shellView.render().el;

		var getServerOptions = function(callback){
			service.getServerOptions().done(function(result){
				global.server.options = result;

				callback(null, global.server.options);
			});
		};

		var getLoginUserInfo = function(callback){
			var user = new User({mode: constants.USER_AUTH});
			user.fetch().done(function(result){
				global.user.id = result.id;
				global.user.login = result.login;
				global.user.name = result.name;
				global.user.avatar = result.avatar_url;
				global.user.url = result.html_url;

				callback(null, user);
			});
		};

		var connectSocketIO = function(callback){
			var socket;
			if (global.server.options.env === 'development')
				socket = socketio.connect('http://localhost:3000');
			else
				socket = socketio.connect('http://gistcamp.nodejitsu.com');
			global.socket = socket;
			console.log('server options :' + global.server.options.env);

			// on connection to server, ask for user's name with an anonymous callback
			global.socket.on('connect', function(){
				// call the server-side function 'adduser' and send one parameter (value of prompt)
				
				// var id = prompt("What's your name?");
				// global.user.id = id;
				// global.user.login = id;

				global.socket.emit('adduser', global.user);
			});

			global.socket.on('updatechat', function (username, data) {
				if (username == 'SERVER') {
					$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');	
				}
				else {
					
					$('#conversation').append('<img src=' + username.avatar + ' style="margin-top:5px;width:20px;height:20px;"/>' +  ' <b>'+username.login + ':</b> ' + data + '<br>');
					//$('#conversation').append('<img src="http://www.gravatar.com/avatar/13edb3b0d8881221c62c3674bcc6339f.png" style="width:20px;height:20px;"/>' +  ' <b>'+username.login + ':</b> ' + data + '<br>');		
				}
				$('#conversation').scrollTop($("#conversation")[0].scrollHeight);
			});

			global.socket.on('updatealarm', function(user, data) {
				var title = 'GistCamp';
				toastr.options = {
				  "positionClass": "toast-bottom-right",
				  "timeOut": 5000
				};
				// data = data.replace(/\n/g, '<br />');
				toastr.info('From ' + user.login + '<br/>' + data, title);
			});

			global.socket.on('updaterooms', function(rooms) {
				global.rooms = rooms;
				postalWrapper.publish(constants.CHAT_UPDATE_ROOM);
			});

			global.socket.on('deleteroom', function(roomname) {
				postalWrapper.publish(constants.CHAT_DELETE_ROOM, roomname);
			});

			callback(null, socket);
		};

		var loadView = function(callback){
			shellView.top.show(topView);
			shellView.footer.show(footerView);
			$('body').html(el);
			callback(null, shellView);
		};

		var showUserInfo = function(callback){
			topView.showUserInfo();
			callback(null, null);
		};

		var startRouter = function(callback){
			var router = new Router;
			Backbone.history.start({pushState: false});
			callback(null, router);
		};

		Application.addInitializer(function(options){
			async.series(
				[
					getServerOptions,
					getLoginUserInfo,
					connectSocketIO,
					loadView,
					showUserInfo,
					startRouter,
					function(err, results){
						console.log('Application initialization has completed');
					}
				]
			);			
		});

		Application.start();
   
	});
});