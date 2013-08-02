require(['jquery', 'underscore', 'application', 'router', 'views/shellView', 
	'views/topView', 'views/footerView', 'constants', 'models/user', 'global',
	'bootstrap', 'prettify', 'nicescroll', 'autoGrow', 'scrollTo'], 
	function($, _, Application, Router, shellView, topView, footerView, constants, User, global){

	$(function(){
		var el = shellView.render().el;
		
		Application.addInitializer(function(options){
			shellView.top.show(topView);
			shellView.footer.show(footerView);
			$('body').html(el);
		});

		Application.addInitializer(function(options){
			var user = new User({mode: constants.USER_AUTH});
			user.fetch().done(function(result){
				global.user.id = result.id;
				global.user.login = result.login;
				global.user.name = result.name;

				topView.setUserInfo();
			});			
		});

		Application.on('initialize:after', function(options){
			var router = new Router;
			Backbone.history.start({pushState: false});
		});

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

		$('.tag').popover({
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
	    });

	    $('#comment-input').autoGrow();

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
		    		if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
		    			$('.gist-list').scrollTo($(prevGist));
		    		$(prevGist).trigger('click');

		    		break;
				case 40 : 	// arrow-down key
		    		if (gistList.length === (selectedGistIndex + 1))
		    			return;

		    		selectedGist.removeClass('selected');
		    		var nextGist = gistList[selectedGistIndex + 1];
		    		$(nextGist).addClass('selected');
		    		if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
		   				$('.gist-list').scrollTo($(nextGist));
	   				$(nextGist).trigger('click');

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