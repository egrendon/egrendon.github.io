(function(skrollr) {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrImageCard', egrImageCard);

	function egrImageCard() {
		var directive = {
			restrict: 'AE',
			"scope": {
				"title": "@",
				"imageSrc": "@",
			},

			template: '<div class="item col-sm-6 col-md-3">' +
                        '<div class="project-wrapper">' +
                            '<div class="project-link">' +
                                '<a href="{{imageSrc}}" class="zoom" title="{{title}}">' +
                                    '<i class="icon-Full-Screen"></i>' +
                                '</a>' +
                                '<a href="#/single-portfolio-1" class="external-link">' +
                                    '<i class="icon-Link"></i>' +
                                '</a>' +
                            '</div>' +
                            '<div class="project-title"><h4>{{title}}</h4></div>'+
                            '<img src="{{imageSrc}}" alt="" class="img-responsive" />'+
                        '</div>' +
                    '</div>',
            replace: true, //element to which the directive declared should be replaced with template        
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {

		}

		//      function controller($scope) {
		//	
		//		}
	}
})(skrollr);
