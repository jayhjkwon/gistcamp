define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Spinner         = require('spin'),
		spinner         = new Spinner()

		loadSpinner = function(enableSpinner){
			if(enableSpinner){
				var target = $('body')[0];
				$('body').append('<div class="loadSpinner"></div>');
				spinner.spin(target);
			}else{
				spinner.stop();					
				$('.loadSpinner').remove();
			}
		}
	;


	return {
		loadSpinner : loadSpinner
	};
});