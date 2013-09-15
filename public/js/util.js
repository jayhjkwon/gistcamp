define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Spinner         = require('spin'),
		spinner         = new Spinner(),

		loadSpinner = function(enableSpinner){
			if(enableSpinner){
				var target = $('body')[0];
				$('.loadSpinner').remove();
				$('body').append('<div class="loadSpinner"></div>');
				spinner.spin(target);
			}else{
				spinner.stop();					
				$('.loadSpinner').remove();
			}
		},

		htmlEncode = function (value){
		  return $('<div/>').text(value).html();
		},

		htmlDecode = function (value){
		  return $('<div/>').html(value).text();
		};
		
	return {
		loadSpinner : loadSpinner,
		htmlEncode  : htmlEncode,
		htmlDecode  : htmlDecode
	};
});