module.exports = function(grunt) {
  // Do grunt-related things in here

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    files: {
        src: 'jquery.toolbar.js',
        min: 'jquery.toolbar.min.js'
    },

    uglify: {
        dist: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            files: {
                '<%= files.min %>' : '<%= files.src %>'
            }
        }
    },

    jshint: {
            // define the files to lint
            files: ['gruntfile.js', '<%= files.src %>'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
            // more options here if you want to override JSHint defaults
            globals: {
                "bitwise": true,
                "camelcase": true,
                "curly": true,
                "eqeqeq": true,
                "forin": true,
                "immed": true,
                "indent": 4,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonew": true,
                "plusplus": true,
                "quotmark": "single",
                "regexp": true,
                "undef": true,
                "unused": true,
                "strict": true,
                "trailing": true,
                "node": true,
                "onevar": true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint']);

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};