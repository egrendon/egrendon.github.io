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
            angular.element(element).css('opacity', 0);

            //IF the element is viewable then add a class
            if (element[0].y < $window.innerHeight) {
                angular.element(element).addClass(scope.animateCss);
                angular.element(element).css('opacity', 1);
                
            }


            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (element[0].getBoundingClientRect().top < $window.innerHeight) {

                    if (scope.animateDelay) {
                        $timeout(callAtTimeout, scope.animateDelay);
                    } else {
                        callAtTimeout();
                    }
                }
            });

            function callAtTimeout() {
                angular.element(element).addClass(scope.animateCss);
                angular.element(element).css('opacity', 1);
                scope.$apply();
            }
        }

        //        function controller($scope) {
        //          
        //        }
    }
})();
