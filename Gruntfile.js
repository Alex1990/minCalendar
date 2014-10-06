'use strict';

module.exports = function(grunt) {

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Projest configuration.
    grunt.initConfig({
        copy: {
            build: {
                files: [
                    {src: 'manifest.json', dest: 'build/'},
                    {src: 'index.html', dest: 'build/'},
                    {src: 'font/*', dest: 'build/'},
                    {src: 'js/lib/*.min.js', dest: 'build/'}
                ]
            }
        },
        uglify: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'js',
                        src: '*.js', 
                        dest: 'build/js'
                    }
                ]
            }
        },
        cssmin: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'css',
                        src: '*.css',
                        dest: 'build/css'
                    }
                ]
            }
        },
        imagemin: {
            build: {
                files: {
                    'build/img/icon-38x38.png': 'img/icon-38x38.png'
                }
            }
        }
    });

    grunt.registerTask('build', ['newer:copy', 'newer:uglify', 'newer:cssmin', 'newer:imagemin']);

    grunt.registerTask('default', ['build']);

};
