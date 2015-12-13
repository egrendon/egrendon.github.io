(function() {
    'use strict';

    angular.module('myFirstApp.core', [
        /*
         * Angular modules
         */
        'ngMaterial',
        'ngAnimate',
         /*
         * Our reusable cross app code modules
         */
        //'blocks.exception',
        'blocks.logger',
        'blocks.router',
        'myFirstApp.services',
        'myFirstApp.directives',
        'myFirstApp.modelObjects',
        /*
         * 3rd Party modules
         */
        'ui.bootstrap',
        'ui.router',
        'smart-table'
    ]);
})();
