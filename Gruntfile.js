'use strict';

var src = [

        // Start
        'src/(open).js',
        'src/pollyfills.js',

        // Core Files
        'src/framework-factory.js',
        'src/environment.js',
        'src/plugins.js',
        'src/type-handlers.js',
        'src/is.js',
        'src/classes-2.js',

        // Type Handlers
        'src/attributes.js',
        'src/events.js',
        'src/callbacks.js',
        'src/properties.js',
        'src/observables.js',

        // End
        'src/(close).js'
    ];

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('src/license.js'),
        concat: {
            options: {
                banner: '<%= license %>'
            },
            main: {
                src: src,
                dest: 'lib/framework-factory.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= license %>'
            },
            main: {
                files: {
                    'lib/framework-factory.min.js': ['lib/framework-factory.js'],
                }
            }
        },
        copy: {
            options: {
                banner: '<%= license %>'
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/plugins/',
                    src: '**',
                    dest: 'lib/plugins/',
                    filter: 'isFile'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Default task(s).
    grunt.registerTask('default', ['concat', 'copy', 'uglify']);
};
