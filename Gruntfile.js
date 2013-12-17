/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	// Override environment based line endings enforced by Grunt
	grunt.util.linefeed = '\n';

	// Grunt configuration
	grunt.initConfig({

		// JSHint the code.
		jshint: {
			options: {
				jshintrc: true,
			},
			all: ['js/*.js'],
		},

		// Clean folders.
		clean: {
			build: ['build/**'],
			tmp: ['tmp/**'],
			dist: ['dist/**']
		},

		// Concatenate files.
		concat: {
			development: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: 'tmp/<%= pkg.name %>.js',
				dest: 'tmp/<%= pkg.name %>.js',
			},
		},

		// Minify files.
		uglify: {
			production: {
				options: {
					banner: '<%= meta.bannerLight %>\n',
					report: 'gzip',
				},
				src: 'tmp/<%= pkg.name %>.js',
				dest: 'tmp/<%= pkg.name %>.min.js'
			},
		},

		// Copy files.
		copy: {
			dist: {
				expand: true,
				cwd: 'tmp',
				src: ['*.js', '*.css'],
				dest: 'dist/',
			},
		},

		// Build components.
		componentbuild: {
			test: {
				options: {
					dev: true,
					sourceUrls: true,
				},
				src: '.',
				dest: 'build',
			},
			production: {
				options: {
					name: '<%= pkg.name %>',
					standalone: 'Tooltip',
				},
				src: '.',
				dest: 'tmp',
			},
			development: {
				options: {
					name: '<%= pkg.name %>',
					standalone: 'Tooltip',
					sourceUrls: true,
				},
				src: '.',
				dest: 'tmp',
			},
		},

		// Watch for changes and run tasks.
		watch: {
			main: {
				files: ['js/*.js', 'css/*.css', 'index.html'],
				options: {
					livereload: true,
				},
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-component-build');

	// Default task.
	grunt.registerTask('default', ['jshint']);
};