/*jshint scripturl:true */
module.exports = function(grunt) {

	var appFiles = [
		'../../app/app.module.js',
		'../../app/app.routes.js',
		//'../../app/app.templates.js',
		'../../app/core/core.module.js',
		'../../app/core/constants.js',
		'../../app/core/directives/directives.module.js',
		'../../app/core/directives/animateInView.directive.js',
		'../../app/core/directives/chartCircle.directive.js',
		'../../app/core/directives/googleMaps.directive.js',
		'../../app/core/directives/imageCard.directive.js',
		'../../app/core/directives/loader.directive.js',
		'../../app/core/directives/matchHeight.directive.js',
		'../../app/core/directives/messagePanel.directive.js',
		'../../app/core/directives/pageScroll.directive.js',
		'../../app/core/directives/parallax.directive.js',
		'../../app/core/directives/stickyMenu.directive.js',

		'../../app/core/modelObjects/modelObjects.module.js',
		'../../app/core/modelObjects/MessageObj.js',

		'../../app/core/services/services.module.js',
		'../../app/core/services/globalWeather.service.js',
		'../../app/core/services/myFirst.base.service.js',
		'../../app/core/services/nextMessage.service.js',
		'../../app/core/services/underscore.service.js',

		'../../app/featureSets/home/home.module.js',
		'../../app/featureSets/home/home.controller.js',
		'../../app/featureSets/home/home.service.js',
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// watcher to automatically test during dev
		watch: {
			js: {
				files: ['../../**/*.js', '../specs/**/*.js'],
				tasks: ['testClient']
			}
		},
		// concatenate files into bundles
		concat: {
			// angular files ready to be tested
			target: {
				src: appFiles,
				dest: 'target.bundle.js'
			},
			// all Mocha specs
			tests: {
				src: ['../specs/**/*.js'],
				dest: 'test.bundle.js'
			}
		},
		// run client tests
		mocha: {
			local: {
				options: {
					run: true,
					reporter: 'Spec',
					clearRequireCache: true,
					log: true,
					logErrors: true
				},
				src: ['testrunner.html']
			},
			jenkins: {
				options: {
					run: true,
					reporter: 'XUnit',
					clearRequireCache: true,
					log: false,
					logErrors: false
				},
				src: ['testrunner.html'],
				dest: '../../../../../reports/client/app-skeleton-portlet-xunit.out',
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-mocha');

	//
	// Targets
	//
	grunt.registerTask('testClient', ['concat:target', 'concat:tests', 'mocha:local']);
	grunt.registerTask('testJenkins', ['concat:target', 'concat:tests', 'mocha:jenkins']);
	grunt.registerTask('default', ['testClient']);

};
