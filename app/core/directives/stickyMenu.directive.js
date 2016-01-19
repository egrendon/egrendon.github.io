/*-------------------------------------------------------------------*/
/*  Directive creates a docked naviaton menu. The navigation menu stays always visible.
/*  Requires jQuery-Sticky plugin.
/*-------------------------------------------------------------------*/
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrStickyMenu', egrStickyMenu);

	egrStickyMenu.$inject = ['$window'];

	function egrStickyMenu($window) {
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

			// Initial LOAD: when the element has finished loading 
			element.ready(function() {
				stickyMenuHelper();
			});


			// On browser window resize event
			angular.element($window).bind('resize', function() {
				stickyMenuHelper();
			});

			/*-------------------------------------------------------------------*/
			/*  5. Make navigation menu on your page always stay visible.
			/*  Requires jQuery-Sticky plugin.
			/*-------------------------------------------------------------------*/
			var stickyMenuHelper = function() {
				var jQueryElementID = "#" + attrs.id;
				var navElement = $(jQueryElementID);
				var maxWidth = Math.max($(window).width(), window.innerWidth);

				if ($.fn.unstick) {
					navElement.unstick();
				}

				if ($.fn.sticky && maxWidth >= 992) {
					navElement.sticky({
						topSpacing: 0
					});
				}
			};
		}

		//      function controller($scope) {
		//	
		//		}
	}
})();
