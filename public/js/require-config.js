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
	    json2          : '../vendor/require-handlebars-plugin/hbs/json2',
	    bootstrap      : '../vendor/bootstrap/docs/assets/js/bootstrap',
	    prettify       : '../vendor/bootstrap/docs/assets/js/google-code-prettify/prettify',
	    nicescroll     : '../vendor/jquery-nicescroll/jquery.nicescroll',
	    autoGrow       : '../vendor/autogrow-textarea/jquery.autogrowtextarea',
	    scrollTo       : '../vendor/jquery.scrollTo/jquery.scrollTo',
	    bootmetroPivot : '../vendor/bootmetro/scripts/bootmetro-pivot'
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
        },
        bootstrap: {
        	deps: ['jquery']
        },
        nicescroll: {
        	deps: ['jquery']
        },
        autoGrow : {
        	deps: ['jquery']
        },
        scrollTo: {
        	deps: ['jquery']
        },
        bootmetroPivot: {
        	deps: ['jquery']
        }
	},
	hbs : {
		templateExtension : 'html',
	    disableI18n : true
	},
    urlArgs: 'modified_time=' +  (new Date()).getTime()
});

