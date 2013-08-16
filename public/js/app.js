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
				//global.socket.emit('adduser', prompt("What's your name?"));

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
				toastr.info('From ' + user.login + '<br/>' + data, title);
			});

			global.socket.on('updaterooms', function(rooms) {
				global.rooms = rooms;
				postalWrapper.publish(constants.CHAT_UPDATE_ROOM);
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



		$('.btn-comments').tooltip();


	    // check if elem is visible
	    var isScrolledIntoView = function(scrollElem, elem) {
		    var docViewTop = $(scrollElem).scrollTop();
		    var docViewBottom = docViewTop + $(scrollElem).height();

		    var elemTop = $(elem).offset().top;
		    var elemBottom = elemTop + $(elem).height();

		    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		};

	    $(document).keydown(function(e){
	    	var gistList, selectedGist, selectedGistIndex;
	    	var keyCode = e.keyCode || e.which;

	    	if (keyCode === 38 || keyCode === 40){
	    		gistList = $('.gist-list .gist-item');
	    		selectedGist = $('.gist-list .gist-item.selected');
	    		selectedGistIndex = gistList.index(selectedGist);
	    	}

	    	switch (keyCode) 
	    	{
				case 38 : 	// arrow-up key
		    		if (selectedGistIndex === 0)
		    			return;

		    		selectedGist.removeClass('selected');
		    		var prevGist = gistList[selectedGistIndex - 1];
		    		$(prevGist).addClass('selected');
		    		$(prevGist).trigger('click');
		    		// if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
		    			$('.gist-list').scrollTo($(prevGist), {offset:-20});		    		

		    		break;
				case 40 : 	// arrow-down key
		    		if (gistList.length === (selectedGistIndex + 1))
		    			return;

		    		selectedGist.removeClass('selected');
		    		var nextGist = gistList[selectedGistIndex + 1];
		    		$(nextGist).addClass('selected');
		    		$(nextGist).trigger('click');
		    		// if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
		   				$('.gist-list').scrollTo($(nextGist), {offset:-20});	   				

		   			break;
				case 37 : 	// arrow-left key
					if ( !$('#comment-input').val())
						$('.btn-comments').trigger('click');
					break;
				case 39 : 	// arrow-right key
					if (!$('#comment-input').val())
						$('.btn-comments').trigger('click');
					break;
				default:
					break;
			}
		});
	});
});