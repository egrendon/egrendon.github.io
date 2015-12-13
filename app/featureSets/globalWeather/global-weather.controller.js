(function() {
	'use strict';

	angular
		.module('myFirstApp.globalWeatherModule')
		.controller('GlobalWeatherCtrlAs', GlobalWeatherCtrlAs);

	GlobalWeatherCtrlAs.$inject = ['$scope', '$location','globalWeatherService', 'nextMessageService'];

	function GlobalWeatherCtrlAs($scope, $location, globalWeatherService, nextMessageService) {
		var vm = this;
		vm.resultData = null;
		vm.contentLoaded = false;
		$scope.rowCollection=[];
		$scope.displayed = [];
	
        /**
         * Method will use the location service to get agencyCodes then do a callback to locationsCallbackAction
         */
        vm.loadDataAction = function() {
        	var countryName = "United States"
			vm.countryName = countryName;
			globalWeatherService.getWeatherCitiesForCountry(vm);
        };
        
        /**
         * Method called post 
         */
		vm.postLoadDataAction = function() {
			//console.log(vm.citiesForCountry);
			$scope.rowCollection = vm.citiesForCountry; 
		
			nextMessageService.set(new MODEL.MessageObj('success', 'Flashhhh message here ....... An email has been sent to .'));
		};
		
		
	    
	    vm.getWeatherForCity = function(row) {
	    	vm.countryName = row.Country;
	    	vm.cityName = row.City;
			$location.path('/globalWeather/'+vm.countryName+"/"+vm.cityName);
		};
		
	}//end of Ctrl	
})();
