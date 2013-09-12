require(['jquery', 'underscore', 'application', 'router', 'views/shellView',
	'views/topView', 'views/footerView', 'constants', 'models/user', 'global', 'async',
	'socketio', 'postalWrapper', 'toastr', 'service', 'mousetrap', 'router',
	'bootstrap', 'prettify', 'nicescroll', 'autoGrow', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, constants, User, global, async, 
		socketio, postalWrapper, toastr, service, mousetrap, Router){
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
					$('#conversation').append(data + '<br>');	
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

		var handleShortcuts = function(callback){
			var moveToGist = function(moveUp){
				var nextGist ;
				var gistList = $('.gist-item-container .row-fluid');
	    		var selectedGist = $('.row-fluid.selected');
	    		var selectedGistIndex = gistList.index(selectedGist);

				if (moveUp){
	    			if (selectedGistIndex === 0) return;
	    			nextGist = gistList[selectedGistIndex - 1];
	    		}else{
	    			nextGist = gistList[selectedGistIndex + 1];
	    			if (!nextGist) return;
				}

				selectedGist.removeClass('selected');
	    		$(nextGist).addClass('selected');
	    		$(nextGist).find('.gist-item').trigger('click');
	   			$('.gist-list').scrollTo($(nextGist), {offset:-20});	
			};

			mousetrap.bind('down', function(){
				moveToGist(false);
				return false;
			});

			mousetrap.bind('up', function(){
				moveToGist(true);
				return false;
			});

			mousetrap.bind('left', function(){
				$('.carousel').carousel('prev');
				return false;
			});

			mousetrap.bind('right', function(){
				$('.carousel').carousel('next');
				return false;
			});

			mousetrap.bind('g n', function(){
				var router = new Router;
				router.navigate('newgist', {trigger: true});
			});

			mousetrap.bind('g f', function(){
				var router = new Router;
				router.navigate('friends', {trigger: true});
			});

			mousetrap.bind('g m', function(){
				var router = new Router;
				router.navigate('mygists', {trigger: true});
			});

			mousetrap.bind('g s', function(){
				var router = new Router;
				router.navigate('starred', {trigger: true});
			});

			mousetrap.bind('g a', function(){
				var router = new Router;
				router.navigate('all', {trigger: true});
			});

			mousetrap.bind('g c', function(){
				var router = new Router;
				router.navigate('chat', {trigger: true});
			});

			mousetrap.bind('g x', function(){
				postalWrapper.publish(constants.STAR);
			});

			callback(null);
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
					handleShortcuts,
					function(err, results){
						console.log('Application initialization has completed');
					}
				]
			);			
		});

		Application.start();
   
	});
});