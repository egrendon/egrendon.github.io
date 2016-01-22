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
                views: {
                    "": {
                        templateUrl: '/app/featureSets/home/home.html'
                    },
                    "header": {
                        templateUrl: '/app/featureSets/home/hero.html'
                    }
                },
                controller: 'HomeCtrlAs',
                controllerAs: 'vm'
            })
            .state('/globalWeather', {
                url: '/globalWeather',
                templateUrl: '/app/featureSets/globalWeather/global-weather.html',
                controller: 'GlobalWeatherCtrlAs',
                controllerAs: 'vm'
            });
    }
})();
