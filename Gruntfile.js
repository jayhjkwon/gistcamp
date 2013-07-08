module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch : {
            options: {
                livereload: true
            },
            less : {
                tasks : 'less:development',
                files : ['./public/styles/**/*.less']
            },
            js : {
                files : ['./public/js/**/*.js']
            },
            html : {
                files : ['./public/js/templates/**/*.html']
            }
        },

        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:8080/js/tests/test.html']
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    /* #1. one giant file optimization */
                    baseUrl       : './public/js',
                    mainConfigFile: './public/js/require-config.js',                    
                    out           : './public/js/app.min.js',
                    name          : 'app',
                    include       : ['require-config'],
                    exclude       : ['jquery', '../vendor/requirejs/require'],
                    // optimize      : 'uglify2',
                    optimize      : 'none',
                    

                    /* 
                        #2. multipage optimization, in this option all files in public-dev directory will be moved to public directory 
                        In order to get benefit this approach(lazy loading), each view should be included (using require() function) in each action method in controller, rather than declared and included on top of the source code.
                    */
                    /*appDir  : "public-dev",
                    dir     : "public",
                    mainConfigFile : 'public-dev/js/require-config.js',
                    baseUrl : "js", 
                    modules : [
                        {
                            name: "app",
                            include: ['jquery', 'domReady', 'underscore', 'backbone', 
                            'marionette', 'handlebars', 'hbs', 'i18nprecompile', 
                            'json2', 'application', 'controller', 'router', 
                            'models/models']
                        },
                        {
                            name: 'views/topView',
                            exclude: ['app']
                        },
                        {
                            name: 'views/userView',
                            exclude: ['app']
                        },
                        {
                            name: 'views/testView',         
                            exclude: ['app']
                        }
                    ],
                    fileExclusionRegExp : /.less$/ ,   // no include *.less
                    removeCombined: true,
                    optimize: 'uglify',
                    skipDirOptimize: true*/
                }
            }
        },

        less: {
            development: {
                options: {
                    paths      : ['./public/styles'],
                    yuicompress: 'false'
                },
                files: {
                    './public/styles/app.min.css': './public/styles/app.less'
                }
            },
            production: {
                options: {
                    paths      : ['./public/styles'],
                    yuicompress: 'true'
                },
                files  : {
                    './public/styles/app.min.css': './public/styles/app.less'
                }
            }
        },

        // clean: ['./public/styles/style.less']
    });

    // Load tasks from NPM
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-clean');

    // register task.
    // grunt.registerTask('default', ['qunit', 'requirejs', 'less']);
    // grunt.registerTask('default', ['requirejs', 'less:production', 'clean']);
    grunt.registerTask('default', ['requirejs', 'less:production']);
};