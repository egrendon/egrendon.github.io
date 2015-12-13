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
				url:'/home',
				templateUrl: '/app/featureSets/home/home.html',
				controller: 'HomeCtrlAs',
				controllerAs: 'vm'
			})
            .state('/globalWeather', {
                url: '/globalWeather',
                templateUrl: '/app/featureSets/globalWeather/global-weather.html',
                controller: 'GlobalWeatherCtrlAs',
                controllerAs: 'vm'
            })
            .state('/globalWeather/:countryName/:cityName', {
                url: '/globalWeather/:countryName/:cityName',
                templateUrl: '/app/featureSets/globalWeather/city-weather.html',
                controller: 'CityWeatherCtrlAs',
                controllerAs: 'vm'
            })
            .state('sell', {
                url: '/sell',
                templateUrl: '/app/featureSets/sell.html',
                controller: 'SellController'
            })
            .state('sell.lemonade', {
                url: '/lemonade',
                templateUrl: '/app/featureSets/sell-lemonade.html',
                controller: function($scope) {
                    $scope.info = {
                        description: 'I love drinking this stuff',
                        health: 'Little lemon ... lots of sugar!'
                    };
                }
            });
    }
})();
