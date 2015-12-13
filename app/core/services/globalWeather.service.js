(function() {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('globalWeatherService', globalWeatherService);

    globalWeatherService.$inject = ['myFirstBaseService'];

    function globalWeatherService(myFirstBaseService) {
        return {
        	getWeatherCitiesForCountryPromsie: function(aCountryName) {
        		return myFirstBaseService.weatherCitiesForCountry.get({countryName:aCountryName}).$promise;
        	},
        	
        	getWeatherForCityPromise: function(aCountryName, aCityName) {
        		return myFirstBaseService.weatherForCity.get({countryName:aCountryName, cityName:aCityName}).$promise;
        	},
        	         
            getWeatherCitiesForCountry: function(vm) {
            	if (!vm.countryName)
            		throw new Error("The param 'countryName' is not allowed to be null.");
            	
            	this.getWeatherCitiesForCountryPromsie(vm.countryName).then(function(response) {
                    if (response.succeeded) {
                    	vm.weatherCitiesForCountryResponse = response;
                    	var data = response.data;
                    	vm.citiesForCountry = data.NewDataSet.Table;
                        vm.postLoadDataAction();
                        vm.contentLoaded = true;
                    } else {
                        vm.messageObj = new MODEL.MessageObj('error', response.msg);
                        vm.contentLoaded = true;
                    }
                })
                .catch(function(error){
                    vm.messageObj = new MODEL.MessageObj('error', 'There was a problem processing your request.');
                    vm.contentLoaded = true;
                });
            },
            getWeatherForCity: function(vm) {
            	if (!vm.countryName)
            		throw new Error("The param 'countryName' is not allowed to be null.");
            	if (!vm.cityName)
            		throw new Error("The param 'cityName' is not allowed to be null.");
            	
            	this.getWeatherForCityPromise(vm.countryName, vm.cityName).then(function(response) {
                    if (response.succeeded) {
                    	vm.weatherCitiesForCountryResponse = response;
                    	var data = response.data;
                    	vm.cityWeather = data.CurrentWeather;
                        vm.postLoadDataAction();
                        vm.contentLoaded = true;
                    } else {
                    	vm.messageObj = new MODEL.MessageObj('error', response.msg);
                        vm.contentLoaded = true;
                    }
                })
                .catch(function(error){
                    vm.messageObj = new MODEL.MessageObj('error', 'There was a problem processing your request.');
                    vm.contentLoaded = true;
                });
            }
        };
    }
})();
