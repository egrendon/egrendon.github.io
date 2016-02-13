(function() {
    'use strict';

    angular
        .module('myFirstApp')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {

        //
        // Define default page
        //
        $urlRouterProvider.otherwise("/home");

        //
        // Define routes
        //
        $stateProvider
            .state('home', {
                url: '/home',
                /** because we have 2 'ui-view' directives on the index.html page **/
                views: {
                    "header": {
                        templateUrl: '/app/featureSets/home/hero.html',
                        controller: 'TopNavMenuCtrlAs',
                        controllerAs: 'vm'
                    },
                    "": {
                        templateUrl: '/app/featureSets/home/home.html',
                        controller: 'HomeCtrlAs',
                        controllerAs: 'vm'
                    }
                },
            })
            .state('/globalWeather', {
                url: '/globalWeather',
                templateUrl: '/app/featureSets/globalWeather/global-weather.html',
                controller: 'GlobalWeatherCtrlAs',
                controllerAs: 'vm'
            });
    }
})();
