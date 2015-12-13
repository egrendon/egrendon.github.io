(function() {
	'use strict';

	angular
		.module('myFirstApp.services')
		.factory('myFirstBaseService', myFirstBaseService);

	myFirstBaseService.$inject = ['$resource', 'serviceConfigObject'];

	function myFirstBaseService($resource, serviceConfigObject) {

		return {			
			myAccount: $resource('/delegate/services/api/myaccount', {}, serviceConfigObject),
			weather: $resource('/delegate/services/api/weather', {}, serviceConfigObject),
			weatherCitiesForCountry: $resource('/delegate/services/api/weather/:countryName', {}, serviceConfigObject),
			weatherForCity: $resource('/delegate/services/api/weather/:countryName/:cityName', {}, serviceConfigObject)
		};
	}

})();
