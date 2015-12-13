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
        'myFirstApp.leftMenuBarModule',
        'myFirstApp.homeModule',
        'myFirstApp.globalWeatherModule'
    ]);

})();
