require.config({
	baseUrl: '../js',
	paths: {
		jquery		   : '../vendor/jquery/jquery',
		domReady       : '../vendor/requirejs-domready/domReady',
	    underscore	   : '../vendor/underscore/underscore',
	    backbone 	   : '../vendor/backbone/backbone',
	    marionette 	   : '../vendor/marionette/lib/backbone.marionette',
	    handlebars     : '../vendor/handlebars.js/dist/handlebars',
	    hbs            : '../vendor/require-handlebars-plugin/hbs',
	    i18nprecompile : '../vendor/require-handlebars-plugin/hbs/i18nprecompile',
	    json2          : '../vendor/require-handlebars-plugin/hbs/json2'
	},
	shim: {
		underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        marionette: {
        	deps: ['jquery', 'underscore', 'backbone'],
        	exports: 'Marionette'
        },
        handlebars: {
        	exports: 'Handlebars'
        }
	},
	hbs : {
		templateExtension : 'html',
	    disableI18n : true
	}
});

