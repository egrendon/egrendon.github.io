/**
 * Directive used to circle charts. 
 * NOTE: Assumes the project is using Animation.css framework.
 * Optionally you can disable for mobile mode. See commented out code.
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
            var bascisElement = element[0].querySelector('.item-progress');
            var itemElement = angular.element(bascisElement);
            var maxHeight = 108;
            var newHeight = maxHeight * (scope.percent / 100);

            // // Disable all animation effects for mobile
            // if (jQuery.browser.mobile === true) {
            //     addStylesToElement();
            //     return;
            // }

            //IF the element is viewable then add a class
            if (itemElement[0].y < $window.innerHeight) {
                addStylesToElement();
            }

            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (itemElement[0].getBoundingClientRect().top < $window.innerHeight) {
                    addStylesToElement();
                    scope.$apply();
                }
            });


           function addStylesToElement() {
                itemElement.addClass('animated fadeIn ');
                itemElement.css('height', newHeight+"px");
            }
        }
    }
})();
