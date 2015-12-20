/**
 * Directive used to circle charts. 
 * 
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrChartCircle', egrChartCircle);

    function egrChartCircle($window) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "percent": "=",
                "value": "@"
            },
            template: '<div class="col-sm-4 col-md-2">' +
                        '<div class="item">' +
                            '<div class="circle">' +
                                '<span class="item-progress" data-percent="{{percent}}"></span>' +
                            '</div>' +
                            '<span class="percent">{{percent}}%</span>' +
                            '<h4 class="text-center">{{value}}</h4>' +
                        '</div>' +
                    '</div>',
            replace: true, //element to which the directive declared should be replaced with template
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            // initialize
            var itemProgressElement = element[0].querySelector('.item-progress');
            var maxHeight = 108;
            var newHeight = maxHeight * (scope.percent / 100);

            //hide the element
            //angular.element(itemProgressElement).css('opacity', 0);

            //IF the element is viewable then add a class
            if (element[0].y < $window.innerHeight) {
                angular.element(itemProgressElement).addClass('animated fadeIn ');
                itemProgressElement.style.height=newHeight+"px";
            }


            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (element[0].getBoundingClientRect().top < $window.innerHeight) {
                    angular.element(itemProgressElement).addClass('animated fadeIn');
                    itemProgressElement.style.height=newHeight+"px";
                    scope.$apply();
                }
            });
        }
    }
})();
