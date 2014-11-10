/*
* Grunt jshint/watch boilerplate configuration.
*
* @author Ryan Nickell
*/
module.exports = function(grunt) {

    /*
    * Helper method to load configuration files for Grunt
    */
    function loadConfig(path) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option) {
            key = option.replace(/\.js$/,'');
            object[key] = require(path + option);
        });

        return  object;
    }

    /*
    * Establish what files need to be examined.
    * The user must create a jshint-files.json file that contains:
    * {
    *    "src" : [
    *       "file.js"
    *    ]
    * }
    * 
    * The same rules apply to globbing as you'd expect.
    */
    var jshintSrc = [];

    var jshintFilesJson = 'jshint-files.json';
    if( grunt.file.exists( jshintFilesJson ) ) {
        var jshintFile = grunt.file.readJSON( jshintFilesJson );
        if( jshintFile.src && jshintFile.src.length ) {
            jshintSrc = jshintFile.src;
        }
    } else {
        console.log('');
        console.log('----------------------------------------');
        console.log('WARNING: No jshint-files.json file found');
        console.log('----------------------------------------');
        console.log('');
    }

    jshintSrc.push( 'Gruntfile.js' );

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            all: {
                src: jshintSrc
            }
        },
        watch: {
            scripts: {
                files: jshintSrc,
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        }
    };

    /*
    * Merge any optional grunt configuration from the ./grunt/options/ directory.
    *
    * This is useful when you want to change the watch tasks configuration to execute
    * additional tasks.
    */
    grunt.util._.merge(config, loadConfig('./grunt/options/'));

    // Project configuration.
    grunt.initConfig(config);

    /*
    * Only JSHint the files that change by dynamically modifying the 
    * file list.
    *
    * See: https://github.com/gruntjs/grunt-contrib-watch
    */
    grunt.event.on('watch', function(action, filepath, target) {
        grunt.config('jshint.all.src', filepath);
    });

    // Load all available tasks
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['jshint']);
};
