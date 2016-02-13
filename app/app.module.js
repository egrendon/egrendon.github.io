(function() {
    'use strict';

    /* App Module */
    angular.module('myFirstApp', [
        'myFirstApp.core',
        'myFirstApp.services',
        'myFirstApp.directives',
        /*
         * Feature Sets
         */
        'myFirstApp.topNavMenuModule',
        'myFirstApp.homeModule'
    ]);

})();
