/*-------------------------------------------------------------------*/
/*  Directive creates the page smooth scrolling feature, requires jQuery Easing plugin. */
/*-------------------------------------------------------------------*/
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrPageScroll', egrPageScroll);

	function egrPageScroll() {
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
            	pageScroll();
            });



            /*-------------------------------------------------------------------*/
		    /*  4. Page scrolling feature, requires jQuery Easing plugin.
		    /*-------------------------------------------------------------------*/
		    var pageScroll = function(){

		    	//For this element select find all HREF tages that have class page-scroll 
		    	var selectorId = "#"+attrs.id + " .page-scroll > a";
		    	var foundElements = $(selectorId);

		    	if (!foundElements || foundElements.length === 0) {
					throw new Error("Zero HREF elements fond with class 'page-scroll'.");
				}

		        foundElements.bind('click', function(e){
		            e.preventDefault();
		            
		            var anchor = $(this),
		            href = anchor.attr('href'),
		            offset = $('body').attr('data-offset');
		            
		            $('html, body').stop().animate({
		                scrollTop: $(href).offset().top - (offset - 1)
		            }, 1500, 'easeInOutExpo');
		            
		            /*
		             * Automatically retract the navigation after clicking 
		             * on one of the menu items.
		             */
		            if(!$(this).parent().hasClass('dropdown')){
		                $('.berg-collapse').collapse('hide');
		            }
		        });
		    };
		}

//      function controller($scope) {
//	
//		}
	}
})();
