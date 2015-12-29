/*-------------------------------------------------------------------*/
/*  Directive creates the page smooth scrolling feature, requires jQuery Easing plugin. */
/*-------------------------------------------------------------------*/
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrStickyMenu', egrStickyMenu);

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
            element.ready(function(){
            	stickyMenu();
            });


            // On browser window resize event
            angular.element($window).bind('resize', function(){
				stickyMenu();
	       	});

		    /*-------------------------------------------------------------------*/
		    /*  5. Make navigation menu on your page always stay visible.
		    /*  Requires jQuery-Sticky plugin.
		    /*-------------------------------------------------------------------*/
		    var stickyMenu = function(){
		    	var jQueryElementID = "#"+attrs.id
		        var ww = Math.max($(window).width(), window.innerWidth),
		        nav = $(jQueryElementID);

		        if ($.fn.unstick){
		            nav.unstick();
		        }
		        
		        if ($.fn.sticky && ww >= 992){
		            nav.sticky({topSpacing: 0});
		        }
		    };
		}

//      function controller($scope) {
//	
//		}
	}
})();
