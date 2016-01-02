/*jshint scripturl:true */
module.exports = function(grunt){
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});

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

		// concatenate files into bundles
		concat: {
			// all js files for jenkins build and deploy
			buildjs: {
				src: appFiles,
				dest: '../dist/app.js'
			}
		},
		// register angular templates in the $templateCache
		ngtemplates: {
			app: {
				cwd: '../../',
				src: 'app/**/*.html',
				dest: '../dist/app.templates.js',
				options: {
					module: 'myFirstApp',
					//prefix: '/agent-portlet'
				}
			}
		},
		// add missing angular dependency injection annotations
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			app: {
				files: {
					'../dist/app.min.js': ['../dist/app.js']
				}
			}
		},
		// minify js and create source map
		uglify: {
			options: {
				sourceMap: true
			},
			my_target: {
				files: {
					'../dist/app.min.js': ['../dist/app.js']
				}
			}
		},
		// minify css
		cssmin: {
			target: {
				files: {
					'../dist/assets/css/main.min.css': ['../../assets/css/main.css','../../assets/css/green.css']
				}
			}
		},
		// replace 'app' refrences with unique guid
		replace: {
			view: {
				src: ['index.html'],
				overwrite: true,
				replacements: [{
					from: '<!-- TARGET -->',
					to: '<script src="app/'+guid+'.js"></script>'
				},{
					from: '<!-- CSSTARGET -->',
					to: '<link rel="stylesheet" href="assets/css/'+guid+'.min.css">'
				}]
			},
			mapfile: {
				src: ['../../app/app.min.js.map'],
				overwrite: true,
				replacements: [{
					from: '"file":"app.min.js"',
					to: '"file":"'+guid+'.min.js"'
				},{
					from: '"sources":["app.js"]',
					to: '"sources":["'+guid+'.js"]'
				}]
			},
			mapurl: {
				src: ['../../app/app.min.js'],
				overwrite: true,
				replacements: [{
					from: '//# sourceMappingURL=app.min.js.map',
					to: '//# sourceMappingURL='+guid+'.min.js.map'
				}]
			}
		},
		// rename 'app' file names with unique guid
		rename: {
			app: {
				src: '../dist/app.js',
				dest: '../dist/'+guid+'.js'
			},
			appmin: {
				src: '../dist/app.min.js',
				dest: '../dist/'+guid+'.min.js'
			},
			map: {
				src: '../dist/app.min.js.map',
				dest: '../dist/'+guid+'.min.js.map'
			},
			css: {
				src: '../dist/assets/css/main.min.css',
				dest: '../dist/assets/css/'+guid+'.min.css'
			}
		},
		// remove angular templates file after concatenation
		clean: {
			options: {
				force: true
			},
			js: ["../dist/app.templates.js"]
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	grunt.registerTask('buildjs', ['cssmin', 'ngtemplates', 'concat:buildjs', 'ngAnnotate', 'uglify', 'replace', 'rename', 'clean']);
	grunt.registerTask('default', ['buildjs']);

};
