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
                    baseUrl       : './public/js',
                    mainConfigFile: './public/js/require-config.js',                    
                    out           : './public/js/app.min.js',
                    name          : 'app',
                    include       : ['../vendor/requirejs/require', 'require-config'],
                    optimize      : 'uglify2',
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