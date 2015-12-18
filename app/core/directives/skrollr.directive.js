(function(skrollr) {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrSkroller', egrSkroller);

	function egrSkroller() {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (jQuery.browser.mobile === false) {
				// This is for parallax using Skrollr
				var s = skrollr.init({
					forceHeight: false
				});

				// Refresh skrollr after resizing our sections
				s.refresh($('.parallax'));

				//skrollr.init().refresh();
			}
		}

//      function controller($scope) {
//	
//		}
	}
})(skrollr);
