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
            .state('single-portfolio-1', {
                url:'/single-portfolio-1',
                templateUrl: '/app/featureSets/portfolio/single-portfolio-1.html',
               // controller: 'TopNavMenuCtrlAs',
              //  controllerAs: 'vm'
            })
          .state('single-portfolio-2', {
                url:'/single-portfolio-2',
                templateUrl: '/app/featureSets/portfolio/single-portfolio-2.html',
               // controller: 'TopNavMenuCtrlAs',
              //  controllerAs: 'vm'
            })
            .state('topNavMenu', {
                url:'/topNavMenu',
                templateUrl: '/app/featureSets/topNavMenu/topNavMenu.html',
                controller: 'TopNavMenuCtrlAs',
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
