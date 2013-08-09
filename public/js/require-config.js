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
        spin           : '../vendor/spin.js/spin',
        moment         : '../vendor/moment/moment',
        postal         : '../vendor/postal.js/lib/postal',
        async          : '../vendor/async/lib/async',
        store          : '../vendor/store.js/store',
        markdown       : '../vendor/markdown/lib/markdown',
        // TODO : Socket.Client는 왜 있는걸까? 나중에 다시 알아보기
        // socketi        : '../vendor/socket.io-client/lib/socket.io-client'
        //socketio       : 'http://localhost:3000/socket.io/socket.io'
        socketio       : '/socket.io/socket.io'
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
        markdown: {
            exports: 'markdown'
        },
        socketio: {
            exports: 'io'
        }
	},
	hbs : {
		templateExtension : 'html',
	    disableI18n : true,
        helperPathCallback: function(name){
            // set path for handlebar helpers
            return 'templates/helpers/' + name;
        }
	}/*,
    urlArgs: 'modified_time=' +  (new Date()).getTime()*/
});

