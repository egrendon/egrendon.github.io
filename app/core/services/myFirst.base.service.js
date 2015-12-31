(function() {
	'use strict';

	angular
		.module('myFirstApp.services')
		.factory('myFirstBaseService', myFirstBaseService);

	myFirstBaseService.$inject = ['$resource', 'serviceConfigConstant'];

	function myFirstBaseService($resource, serviceConfigConstant) {

		return {			
			myAccount: $resource('/delegate/services/api/myaccount', {}, serviceConfigConstant),
			weather: $resource('/delegate/services/api/weather', {}, serviceConfigConstant),
			weatherCitiesForCountry: $resource('/delegate/services/api/weather/:countryName', {}, serviceConfigConstant),
			weatherForCity: $resource('/delegate/services/api/weather/:countryName/:cityName', {}, serviceConfigConstant)
		};
	}

})();
