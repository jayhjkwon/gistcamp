define(function(require){
	var 
		Handlebars = require('handlebars'),
		_          = require('underscore')
	;

	Handlebars.registerHelper('tagList', function(items, options){
		var html = '';

		if (!items) return '';

		// <i class="icon-tag"></i>&nbsp;<span>JavaScript,&nbsp;C#,&nbsp;Ruby On Rails,&nbsp;Node.js,&nbsp;Backbone</span>
		for(var i=0, l=items.length; i<l; i++) {
			if (i===0){
				html = '<i class="icon-tag"></i>&nbsp;<span>' + items[i] + ', ';
			}else{
				html = html + items[i] + ', ';
			}			
		}

		if (html){
			html = html.substring(0, html.lastIndexOf(','));
		}

		html = html + '</span>';

		return html;
	});
});