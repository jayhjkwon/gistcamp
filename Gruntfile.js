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
                    baseUrl       : '.public/js',
                    mainConfigFile: '.public/js/require-config.js',
                    out           : './js/app.min.js',
                    include       : ['require-config'],
                    optimize      : 'none'
                }
            }
        },

        less: {
            development: {
                options: {
                    paths      : ['./public/styles']
                },
                files: {
                    './public/styles/app-dev.min.css': './public/styles/style.less'
                }
            },
            production: {
                options: {
                    paths      : ['./public/styles'],
                    yuicompress: 'true'
                },
                files  : {
                    './public/styles/app.min.css': './public/styles/style.less'
                }
            }
        }
    });

    // Load tasks from NPM
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // register task.
    grunt.registerTask('default', ['qunit', 'requirejs', 'less']);

};