<<<<<<< HEAD
require(['jquery', 'underscore', 'application', 'router', 'views/shellView', 
<<<<<<< HEAD
	'views/topView', 'views/footerView', 'constants', 'models/user', 'global',
	'bootstrap', 'prettify', 'nicescroll', 'autoGrow', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, constants, User, global){
=======
require(['jquery', 'underscore', 'application', 'router', 'views/shellView', 'views/topView', 'views/footerView', 'io',
	'bootstrap', 'prettify', 'nicescroll', 'autoGrow', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, io){
>>>>>>> hotfixes/patched
=======
	'views/topView', 'views/footerView', 'constants', 'models/user', 'global', 'async',
	'bootstrap', 'prettify', 'nicescroll', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, constants, User, global, async){
>>>>>>> 967a7887dda2424a5611ec51c9628f1e6d9f4214

	$(function(){
		var el = shellView.render().el;

<<<<<<< HEAD
		Application.addInitializer(function(options){
<<<<<<< HEAD
=======
		var getLoginUserInfo = function(callback){
>>>>>>> 967a7887dda2424a5611ec51c9628f1e6d9f4214
			var user = new User({mode: constants.USER_AUTH});
			user.fetch().done(function(result){
				global.user.id = result.id;
				global.user.login = result.login;
				global.user.name = result.name;
				global.user.avatar = result.avatar_url;

				callback(null, user);
			});			
<<<<<<< HEAD
=======
			var socket = io.connect();
>>>>>>> hotfixes/patched
		});
=======
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
>>>>>>> 967a7887dda2424a5611ec51c9628f1e6d9f4214

		var startRouter = function(callback){
			var router = new Router;
			Backbone.history.start({pushState: false});
			callback(null, router);
		};

		Application.addInitializer(function(options){
			async.series(
				[
					getLoginUserInfo,
					loadView,
					showUserInfo,
					startRouter,
					function(err, results){
						console.log('Application initialization has completed');
					}
				]
			);			
		});

<<<<<<< HEAD

=======
		// Application.on('initialize:after', function(options){
		// 	// var router = new Router;
		// 	// Backbone.history.start({pushState: false});
		// });
>>>>>>> 967a7887dda2424a5611ec51c9628f1e6d9f4214

		Application.start();








		// $('.gist-list').niceScroll({cursorcolor: '#eee'});
		// $('.files-wrapper').niceScroll({cursorcolor: '#eee'});
		// $('.comments-wrapper').niceScroll({cursorcolor: '#eee'});

		$('.btn-comments').tooltip();

		/*$('.btn-comments').click(function (e) {
		  	e.preventDefault();
		  	if($('.comments-wrapper').css('right') == '-300px'){
		  		$('.files-wrapper').css('right', '300px');
		  		$('.comments-wrapper').css('right','0px');	  
		  		setTimeout(function(){
			  		$('#comment-input').focus();
			  	},300);		
		  	}else{
		  		$('.files-wrapper').css('right', '0px');
		  		$('.comments-wrapper').css('right','-300px');
		  	}*/

		  	/*if($('.comments-wrapper').css('margin-left') == '0px'){
		  		// $('.files-wrapper').css('right', '300px');
		  		$('.comments-wrapper').css('margin-left','-300px');	  
		  		setTimeout(function(){
			  		$('#comment-input').focus();
			  	},300);		
		  	}else{
		  		// $('.files-wrapper').css('right', '0px');
		  		$('.comments-wrapper').css('margin-left','0px');
		  	}*/

		  	/*setTimeout(function(){
		  		$('.files-wrapper').getNiceScroll().resize();	
		  	},300);
		  	
		});	*/

	    /*$('.carousel').carousel({
	    	interval: false
	    });*/

	    /*$('.pivot-headers a').click(function(e){
	    	e.preventDefault();
	    	// $('.files-wrapper').niceScroll();

	    	$('.pivot-headers a').removeClass('active');
	    	$(this).addClass('active');
	    });*/

	    // listen to slide event completion
	    /*$('#pivot').on('slid', function(){
	    	// Check for scrollbars resize (when content or position have changed)
	    	$('.files-wrapper').getNiceScroll().resize();
	    });*/

	    /*$('.gist-item').click(function(){
			$('.gist-item').removeClass('selected');
			$(this).toggleClass('selected');

			$('.comments-badge').hide().show(500);
		});*/	

		/*prettyPrint();	*/

		/*$('.tag').popover({
			html	: true,
			trigger : 'click',
			placement: 'top',
			title	: '<div><i class="icon-plus"></i> Add Tag</div>',
			content : '<div class="add-tag">' +
	                      '<ul>' +
	                        '<li><a href="#">Important <span class="badge badge-inverse pull-right">16</span></a></li>' +
	                        '<li><a href="#">JavaScript <span class="badge badge-inverse pull-right">6</span></a></li>' +
	                        '<li><a href="#">C# <span class="badge badge-inverse pull-right">1</span></a></li>' +
	                        '<li><input type="text" placeholder="New Tag" /></li>' +
	                      '</ul>' +
	                    '</div>'
	    });*/

	    // $('#comment-input').autoGrow();

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