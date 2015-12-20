/**
 * Directive used to inject animation styles into the DOM when an element comes into view. 
 * NOTE: Assumes the project is using Animation.css framework.
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrAnimateInView', egrAnimateInView);

    function egrAnimateInView($window, $timeout) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "animateCss": "@",
                "animateDelay": "@",
            },
            //template: '',
            link: link,
            //controller: controller
        };

        return directive;

        function link(scope, element, attrs) {
            //hide the element
            var itemElement = angular.element(element);
            itemElement.css('opacity', 0);

            //IF the element is viewable then add a class
            if (itemElement[0].y < $window.innerHeight) {
                addStylesToElement();
            }


            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (itemElement[0].getBoundingClientRect().top < $window.innerHeight) {
                    if (scope.animateDelay) {
                        $timeout(addStylesToElement, scope.animateDelay);
                    } else {
                        addStylesToElement();
                    }
                    scope.$apply();
                }
            });

            function addStylesToElement() {
                itemElement.addClass(scope.animateCss);
                itemElement.css('opacity', 1);
            }
        }

        //        function controller($scope) {
        //          
        //        }
    }
})();
