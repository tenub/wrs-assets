module.exports = function (grunt) {

	var pkg = require('./package.json');

	grunt.registerTask('default', ['tasks']);
	grunt.registerTask('tasks', function() {
		grunt.log.subhead('Please choose a grunt task:');
		grunt.log.ok('"grunt build" - builds assets used for wrs api');
		grunt.log.ok('"grunt deploy" - deploy assets to server after building');
	});
	grunt.registerTask('build', function(n) {
		if (n && n === 'nosass') {
			grunt.task.run(['clean', 'csslint:lax', 'jshint', 'concat', 'autoprefixer', 'cleanempty', 'cssmin', 'uglify', 'copy:images']);
		} else {
			grunt.loadNpmTasks('grunt-contrib-sass');
			grunt.task.run(['clean', 'sass', 'csslint:lax', 'jshint', 'concat', 'autoprefixer', 'cleanempty', 'cssmin', 'uglify', 'copy:images']);
		}
	});
	grunt.registerTask('doc', 'jsdoc:all');
	grunt.registerTask('deploy', ['sftp-deploy']);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cleanempty');
	grunt.loadNpmTasks('grunt-sftp-deploy');

	grunt.initConfig({

		'clean': {
			all: ['build', 'dist']
		},

		'sass': {
			dist: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'src/',
					src: '**/*.scss',
					dest: 'build/css/compiled',
					ext: '.css'
				}]
			}
		},

		'csslint': {
			strict: {
				options: {
					'import': 2
				},
				src: ['src/**/*.css', 'build/css/compiled/*.css']
			},
			lax: {
				options: {
					'adjoining-classes': false,
					'box-sizing': false,
					'box-model': false,
					'floats': false,
					'font-sizes': false,
					'ids': false,
					'import': false,
					'known-properties': false,
					'outline-none': false,
					'overqualified-elements': false,
					'qualified-headings': false,
					'unique-headings': false,
					'universal-selector': false,
					'unqualified-attributes': false
				},
				src: ['src/**/*.css', 'build/css/compiled/*.css']
			}
		},

		'jshint': {
			all: [
				'Gruntfile.js',
				'src/**/*.js'
			]
		},

		'jsdoc': {
			dist: {
				src: ['src/**/*.js'],
				options: {
					destination: 'doc'
				}
			}
		},

		'concat': {
			css: {
				src: ['src/**/*.css', 'build/css/compiled/*.css'],
				dest: 'build/css/main.css'
			},
			js: {
				src: 'src/js/*.js',
				dest: 'build/js/main.js'
			}
		},

		'autoprefixer': {
			no_dest: {
				src: 'build/css/main.css'
			}
		},

		'cssmin': {
			compress: {
				files: {
					'dist/css/main.min.css': [
						'build/css/main.css'
					]
				}
			}
		},

		'uglify': {
			js: {
				files: {
					'dist/js/main.min.js': [
						'build/js/main.js'
					]
				}
			}
		},

		'copy': {
			images: {
				files: [
					{
						expand: true,
						flatten: true,
						dest: 'dist/img/',
						src: 'src/img/*'
					},
					{
						expand: true,
						flatten: true,
						dest: 'build/img/',
						src: 'src/img/*'
					}
				]
			}
		},

		'cleanempty': {
			dist: {
				src: ['build/**/*', 'dist/**/*']
			},
		},

		'sftp-deploy': {
			build: {
				auth: {
					host: 'kz.joczn.com',
					port: 22,
					authKey: 'key1'
				},
				src: 'dist',
				dest: '/www/assets',
				exclusions: ['dist/**/.DS_Store', 'dist/**/Thumbs.db', 'dist/tmp'],
				server_sep: '/'
			}
		}

	});

};