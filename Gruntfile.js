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
        files : ['./public/js/**/*.js', './public/js/views/**/*.js', './public/js/models/**/*.js']
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
          paths: {
            socketio : 'empty:'
          }
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
          './public/styles/app.min.css': './public/styles/app.less',
          './public/styles/welcome.min.css': './public/styles/welcome.less'
        }
      },
      production: {
        options: {
          paths      : ['./public/styles'],
          yuicompress: 'true'
        },
        files  : {
          './public/styles/app.min.css': './public/styles/app.less',
          './public/styles/welcome.min.css': './public/styles/welcome.less'
        }
      }
    },

    uglify: {
      welcome: {
        files: {
          './public/js/welcome.min.js': 
          [
          './public/vendor/jquery/jquery.js', 
          './public/vendor/bootstrap/js/bootstrap-modal.js',
          './public/js/welcome.js'
          ]
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          './public/styles/app-thirdparty.min.css': 
          [
          './public/vendor/bootstrap/docs/assets/css/bootstrap.css',
          './public/vendor/font-awesome/css/font-awesome.css', 
          './public/vendor/toastr/toastr.css',
          './public/vendor/select2/select2.css',
          './public/vendor/tipsy/src/stylesheets/tipsy.css'
          /*'./public/vendor/fancybox/source/jquery.fancybox.css'*/
          ],
          './public/styles/welcome-thirdparty.min.css': 
          [
          './public/vendor/bootstrap/docs/assets/css/bootstrap.css',
          './public/vendor/font-awesome/css/font-awesome.css'
          ]
        }
      }
    },

    jshint: {
      options: {
        smarttabs : true,
        '-W099': true, 
        '-W058': true,
        curly: false,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
        ignores: ['public/js/**/*.min.js']
      },
      files: ['public/js/**/*.js']
    },

    jsbeautifier : {
      files : ['public/js/**/*.js', 'infra/**/*.js', 'models/**/*.js', 'routes**/*.js', 'server.js'],
      options : {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 80
        }
      }
    }
  });

    // Load tasks from NPM
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // register task.
    grunt.registerTask('default', ['requirejs', 'less:production', 'cssmin', 'uglify']);
  };