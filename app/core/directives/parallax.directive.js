/*-------------------------------------------------------------------*/
/*  Directive does the parallax background effect. Requires skrollr js library.
/*-------------------------------------------------------------------*/
(function(skrollr) {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrParallax', egrParallax);

	function egrParallax() {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (!attrs.id) {
				throw new Error("Missing a required attribute 'id'.");
			}

			if (jQuery.browser.mobile === false) {
				// This is for parallax using Skrollr
				var s = skrollr.init({
					forceHeight: false
				});

				var  jQueryElementIDSelector = "#"+attrs.id+" > .parallax";

				// Refresh skrollr after resizing our sections
				s.refresh($(jQueryElementIDSelector));

				//skrollr.init().refresh();
			}
		}

//      function controller($scope) {
//	
//		}
	}
})(skrollr);
