/**
 * Directive used to match all the children of the directive element.
 * All the children elements will be matched up by height.
 */
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrMatchHeight', egrMatchHeight);

	function egrMatchHeight($window) {
		var directive = {
			restrict: 'AE',
			"scope": {
				"matchingCss": "@"
			},
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
            var i;
            var heightsArray = [];
            var largest = 0;
            /**
             * Return the largest number in the array
             * @name largetsNo
             * @param  {Array} array - The array of heights
             * @return {Number} the largest number
             */
            var largetsNo = function( array ){
                return Math.max.apply( Math, array );
            };

            var adjustHeight = function(){
           		// Find the element by its class attribute, within your controller's scope
	           	var myElements = element[0].children;
	           	if (!myElements || (myElements && myElements.length === 0)) {
	        		throw new Error("zero children found for elements where directive is declared");
	        	}

                // loop through all the children and get their heights
                for ( i = 0; i < myElements.length; i++) {

                    // add the heights to the array if not undefined
                    // e.g a comment will be picked up
                    if( myElements[i].offsetHeight ){
                        heightsArray.push( myElements[i].offsetHeight );
                    }
                }

                // get the largest height
                largest = largetsNo( heightsArray );

                // add the height to the children
                for ( i = 0; i < myElements.length; i++) {
                	var itemElement = angular.element(myElements[i]);
                	itemElement.css( 'height', largest + 'px' );
                }
            };

            // Initial LOAD: when the element has finished loading 
            element.ready(function(){
            	adjustHeight();
            });

            // On browser window resize event
            angular.element($window).bind('resize', function(){
            	// first remove style attribute from monitored elements
            	var myElements = element[0].children;
                for ( i = 0; i < myElements.length; i++) {
                	$(myElements[i]).removeAttr("style");
                }
            	// then call height adjust
            	adjustHeight();
	       });



		}

//      function controller($scope) {
//	
//		}
	}
})();
