(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrAnimateInView', egrAnimateInView);

    function egrAnimateInView($window) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "animateCss": "@",
            },
            //template: '',
            link: link,
            //controller: controller
        };

        return directive;

        function link(scope, element, attrs) {
            //IF the element is viewable then add a class
            if (element[0].y < $window.innerHeight) {
                angular.element(element).addClass(scope.animateCss);
            }


            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (element[0].getBoundingClientRect().top < $window.innerHeight) {

                    angular.element(element).addClass(scope.animateCss);
                    scope.$apply();
                }
            });
        }

        //        function controller($scope) {
        //          
        //        }
    }
})();
