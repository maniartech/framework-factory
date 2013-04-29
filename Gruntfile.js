/**
 * framework-factory
 * http://framework-factory.com/
 *
 * Copyright (c) 2013 Maniar Technologies Private Limited
 * Author Mohamed Aamir Maniar
 * Licensed under the MIT license.
 * https://framework-factory.com/LICENSE-MIT
 *
 **/

'use strict';

var src = [
        'src/pollyfills.js',
        'src/core.js',
        'src/is.js',
        'src/classes.js',
        'src/attributes.js',
        'src/events.js'
    ],

    srcExtended = src.concat([
        'src/properties.js',
        'src/observables.js'
    ]),

    plugins = [
        'src/plugins/deep-copy.js',
        'src/plugins/utils.js'
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
            },
            x: {
                src: srcExtended,
                dest: 'lib/framework-factory-x.js'
            },
            all: {
                src: srcExtended.concat(plugins),
                dest: 'lib/framework-factory-all.js'
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
        uglify: {
            options: {
                banner: '<%= license %>'
            },
            main: {
                files: {
                    'lib/framework-factory.min.js': ['lib/framework-factory.js'],
                    'lib/framework-factory.x.min.js': ['lib/framework-factory-x.js'],
                    'lib/framework-factory-all.min.js': ['lib/framework-factory-all.js'],
                    'lib/plugins/deep-copy.min.js': ['lib/plugins/deep-copy.js'],
                    'lib/plugins/utils.min.js': ['lib/plugins/utils.js']
                }
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
    grunt.registerTask('default', ['concat:main', 'concat:x', 'concat:all', 'copy:main', 'uglify']);
};
