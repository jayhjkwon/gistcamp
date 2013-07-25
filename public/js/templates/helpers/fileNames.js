define(function(require){
	var 
		Handlebars = require('handlebars'),
		_          = require('underscore')
	;

	Handlebars.registerHelper('fileNames', function(items, options){
		var html = '';

		if (!items) return '';

		for(var i=0, l=items.length; i<l; i++) {
			var slideNum = i;
			if (i===0){
				html = html + '<a href="#pivot" data-slide-to="' + slideNum + '" class="active">' + items[i].filename + '</a>';
			}else{
				html = html + '<a href="#pivot" data-slide-to="' + slideNum + '" >' + items[i].filename + '</a>';	
			}
			
		}

		return html;
	});
});