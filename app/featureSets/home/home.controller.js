angular.module('myFirstApp.homeModule', ['ConsoleLogger'])
.run(['PrintToConsole', function(PrintToConsole) {
    PrintToConsole.active = true;

    console.dir(PrintToConsole);
}]);


angular.module("ConsoleLogger", [])
    .factory("PrintToConsole", ["$rootScope", function($rootScope) {
        var handler = {
            active: false
        };
        handler.toggle = function() {
            handler.active = !handler.active;
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (handler.active) {
                console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
                console.log(arguments);
            };
        });
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (handler.active) {
                console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                console.log(arguments);
            };
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (handler.active) {
                console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
                console.log(arguments);
            };
        });
        $rootScope.$on('$viewContentLoading', function(event, viewConfig) {
            if (handler.active) {
                console.log("$viewContentLoading --- event, viewConfig");
                console.log(arguments);
            };
        });
        $rootScope.$on('$viewContentLoaded', function(event) {
            if (handler.active) {
                console.log("$viewContentLoaded --- event");
                console.log(arguments);
            };
        });
        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            if (handler.active) {
                console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
                console.log(arguments);
            };
        });
        return handler;
    }]);


(function() {
    'use strict';

    angular
        .module('myFirstApp.homeModule')
        .controller('HomeCtrlAs', HomeCtrlAs);

    //HomeCtrlAs.$inject = ['homeService'];

//console.dir(PrintToConsole);
    function HomeCtrlAs() {
        var vm = this;
        vm.resultData = null;

        vm.myAccountAction = function() {
            vm.resultData = homeService.getMyAccount(vm);
        };

        vm.getWeatherAction = function() {
            vm.resultData = homeService.getWeather(vm);
        };

        vm.saveWeatherAction = function() {
            vm.weatherModel = {
                status: "This is PUT angular",
                some: "angular something here"
            };
            vm.resultData = homeService.saveWeather(vm);
        };

    } //end of Ctrl	
})();
