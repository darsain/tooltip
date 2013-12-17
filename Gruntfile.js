/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	// Override environment based line endings enforced by Grunt
	grunt.util.linefeed = '\n';

	// Grunt configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('meta.json'),
		meta: {
			banner: '/*!\n' +
				' * <%= pkg.name %> <%= pkg.version %> - <%= grunt.template.today("dS mmm yyyy") %>\n' +
				' * <%= pkg.repository.homepage %>\n' +
				' *\n' +
				' * Licensed under the <%= pkg.licenses[0].type %> license.\n' +
				' * <%= pkg.licenses[0].url %>\n' +
				' */\n',
			bannerLight: '/*! <%= pkg.name %> <%= pkg.version %>' +
				' - <%= grunt.template.today("dS mmm yyyy") %> | <%= pkg.repository.homepage %> */\n',
		},

		// JSHint the code.
		jshint: {
			options: {
				jshintrc: true,
			},
			all: ['index.js'],
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
			style: {
				options: {
					banner: '<%= meta.bannerLight %>'
				},
				src: 'tmp/<%= pkg.name %>.css',
				dest: 'tmp/<%= pkg.name %>.css',
			},
		},

		// Minify files.
		uglify: {
			production: {
				options: {
					banner: '<%= meta.bannerLight %>',
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

		// Create zipfiles.
		compress: {
			options: {
				level: 9,
				pretty: true,
			},
			standalone: {
				options: {
					archive: 'dist/tooltip.zip',
				},
				expand: true,
				cwd: 'tmp',
				src: ['*'],
			},
		},

		// Watch for changes and run tasks.
		watch: {
			component: {
				files: ['index.js', '*.css'],
				tasks: ['componentbuild:test'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
			test: {
				files: ['test/*.js', 'test/*.css'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},

		// Bump up fields in JSON files.
		bumpup: {
			options: {
				updateProps: {
					pkg: 'meta.json',
				},
			},
			files: ['meta.json', 'component.json'],
		},

		// Commit changes and tag the latest commit with a version from JSON file.
		tagrelease: '<%= pkg.version %>'
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-component-build');
	grunt.loadNpmTasks('grunt-tagrelease');
	grunt.loadNpmTasks('grunt-bumpup');

	// Dev task.
	grunt.registerTask('dev', function () {
		grunt.task.run('componentbuild:test');
	});

	// Build task.
	grunt.registerTask('dist', function () {
		grunt.task.run('jshint');
		grunt.task.run('clean:tmp');
		grunt.task.run('clean:dist');
		// Production
		grunt.task.run('componentbuild:production');
		grunt.task.run('uglify:production');
		// Development
		grunt.task.run('componentbuild:development');
		grunt.task.run('concat:development');
		// Distribution
		grunt.task.run('concat:style');
		grunt.task.run('copy:dist');
		grunt.task.run('compress');
		// Cleanup
		grunt.task.run('clean:tmp');
	});

	// Release task.
	grunt.registerTask('release', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('jshint');
		grunt.task.run('bumpup:' + type);
		grunt.task.run('tagrelease');
	});

	// Default task.
	grunt.registerTask('default', ['jshint']);
};