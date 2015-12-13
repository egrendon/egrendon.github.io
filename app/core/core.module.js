(function() {
    'use strict';

    angular.module('myFirstApp.core', [
        /*
         * Angular modules
         */


         /*
         * Our reusable cross app code modules
         */
        'myFirstApp.services',
        'myFirstApp.directives',
        'myFirstApp.modelObjects',
        
        /*
         * 3rd Party modules
         */
        'ui.bootstrap',
        'ui.router',
    ]);
})();
