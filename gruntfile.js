module.exports = function (grunt) {
	'use strict';

    // Add tasks
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');


    // Project configuration
    grunt.initConfig({
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                proto: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            tests: {
                options: {
                    globals: {
                        describe: true,
                        it: true
                    }
                },
                src: ['test/spec/*.js']
            },
            scripts: {
                src: ['game/**/*.js', 'app.js']
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/spec/*.js']
            }
        },

        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    watch: ['game', 'app.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['game/**/*.js', 'app.js'],
                tasks: ['jshint:scripts'],
                options: {
                    spawn: false
                }
            }
        }
    });


    // Command line tasks
    grunt.registerTask('serve', ['concurrent']);
    grunt.registerTask('test', ['jshint', 'mochaTest']);
};
