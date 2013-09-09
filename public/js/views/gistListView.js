define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Marionette 		= require('marionette'),
		gistListTemplate= require('hbs!templates/gistListTemplate'),
		Application 	= require('application'),
		constants 		= require('constants'),		
		nicescroll 		= require('nicescroll'),
		bootstrap 		= require('bootstrap'),
		prettify 		= require('prettify'),	
		bootstrap 		= require('bootstrap'),	

		GistListView = Marionette.Layout.extend({
			currentSelectedMenu : '',

			initialize: function(menu){
				var self = this;
				console.log('GistListView initialized');

				_.bindAll(this, 'onClose', 'onDomRefresh');

				if (this.options.currentSelectedMenu)
					self.currentSelectedMenu = this.options.currentSelectedMenu;
					console.log('currentSelectedMenu= ' + self.currentSelectedMenu);
				if (this.options.tag)
					console.log('tag= ' + this.options.tag);	

				this.handleShortCuts();
			},

			className: 'main-content',
			
			template : gistListTemplate,

			regions : {
				gistItemList    : '#gist-item-list',
				filesWrapper    : '#files-wrapper',
				commentsWrapper : '#comments-wrapper'
			},

			events : {
				'click .pivot-headers a' : 'onFileNameClicked'
			},

			onRender: function(){
				// this.handleShortCuts();
			},

			onDomRefresh: function(){
				// if ( !$('#comment-input').val())
				// 	$('.btn-comments').trigger('click');
			},

			onFileNameClicked : function(e){
				e.preventDefault();
		    	$('.pivot-headers a').removeClass('active');
		    	$(e.currentTarget).addClass('active');
			},

			onMenuChanged: function(){
				console.log('onMenuChanged');
			},

			// check if elem is visible
		    isScrolledIntoView : function(scrollElem, elem) {
			    var docViewTop = $(scrollElem).scrollTop();
			    var docViewBottom = docViewTop + $(scrollElem).height();

			    var elemTop = $(elem).offset().top;
			    var elemBottom = elemTop + $(elem).height();

			    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
			},

			handleShortCuts: function(){
				$(document).off('keydown').on('keydown', function(e){
			    	var gistList, selectedGist, selectedGistIndex;
			    	var keyCode = e.keyCode || e.which;

			    	if (keyCode === 38 || keyCode === 40){
			    		gistList = $('.gist-item-container .row-fluid');
			    		selectedGist = $('.row-fluid.selected');
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
				    		$(prevGist).find('.gist-item').trigger('click');
				    		// if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
				    		$('.gist-list').scrollTo($(prevGist), {offset:-20});		    		

				    		break;
						case 40 : 	// arrow-down key
				    		if (gistList.length === (selectedGistIndex + 1))
				    			return;

				    		selectedGist.removeClass('selected');
				    		var nextGist = gistList[selectedGistIndex + 1];
				    		$(nextGist).addClass('selected');
				    		$(nextGist).find('.gist-item').trigger('click');
				    		// if (!isScrolledIntoView('.gist-list', '.gist-list .gist-item.selected'))
				   			$('.gist-list').scrollTo($(nextGist), {offset:-20});	   				

				   			break;
						case 37 : 	// arrow-left key
							// if ( !$('#comment-input').val())
							// 	$('.btn-comments').trigger('click');
							$('.carousel').carousel('prev');
							break;
						case 39 : 	// arrow-right key
							// if (!$('#comment-input').val())
							// 	$('.btn-comments').trigger('click');
							$('.carousel').carousel('next');
							break;
						default:
							break;
					}
				});
			},		    

			onClose: function(){
			}
		})
	;

	return GistListView;
});