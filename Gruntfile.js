module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
        prod: {
            options: {
                yuicompress: false
            },
            files: [
                {
                    src: 'less/jquery.toolbar.less',
                    dest: 'jquery.toolbar.css'
                }
            ]
        }
    },
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
    grunt.loadNpmTasks('grunt-contrib-less');

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint']);

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

    grunt.registerTask('build', ['less']);
	

};
