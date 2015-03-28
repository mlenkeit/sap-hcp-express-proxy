module.exports = function(grunt) {

	grunt.initConfig({
		paths: {
			libFiles: 'lib/**/*.js',
			testFiles: 'test/**/*.js'
		},
		mochaTest: {
			lib: {
				options: {
					quiet: false,
					clearRequireCache: true
				},
				src: ['<%= paths.libFiles %>', '<%= paths.testFiles %>']
			}
		},
		watch: {
			options: {
				spawn: false
			},
			lib: {
				files: ['<%= paths.libFiles %>', '<%= paths.testFiles %>'],
				tasks: ['mochaTest:lib']
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', ['mochaTest:lib']);

};