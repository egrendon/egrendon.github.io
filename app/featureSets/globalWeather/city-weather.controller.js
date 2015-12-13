(function() {
	'use strict';

	angular
		.module('myFirstApp.globalWeatherModule')
		.controller('CityWeatherCtrlAs', CityWeatherCtrlAs);

	CityWeatherCtrlAs.$inject = ['$stateParams','globalWeatherService', 'nextMessageService'];

	function CityWeatherCtrlAs($stateParams, globalWeatherService, nextMessageService) {
		var vm = this;
		vm.resultData = null;
		vm.contentLoaded = false;
		vm.countryName = $stateParams.countryName;
		vm.cityName = $stateParams.cityName;
	
        /**
         * Method will use the location service to get agencyCodes then do a callback to locationsCallbackAction
         */
        vm.loadDataAction = function() {
			globalWeatherService.getWeatherForCity(vm);
        };
        
        /**
         * Method called post 
         */
		vm.postLoadDataAction = function() {
			var isCityDataEmpty = jQuery.isEmptyObject(vm.cityWeather); // true
			if (isCityDataEmpty) {
				vm.messageObj = new MODEL.MessageObj('warning', 'The location '+vm.cityName+' does not have weather information at this time.');
				
				var messageObj1 = new MODEL.MessageObj('danger', 'Hoooooooooo '+vm.cityName+' fffffffff.');
				var messageObj2 = new MODEL.MessageObj('success', 'Baaaaaaaaaaa '+vm.cityName+' vvvvvvvvvvvvv.');
				var messageObj3 = new MODEL.MessageObj('warning', 'zzzzzzzzzzz '+vm.cityName+' vvvvvvvvvvvvv.');
				var messageObj4 = new MODEL.MessageObj('info', 'xxxxxxxxxxx '+vm.cityName+' vvvvvvvvvvvvv.');
				var messageObj5 = new MODEL.MessageObj('error', 'yyyyyyyyy '+vm.cityName+' vvvvvvvvvvvvv.');
				vm.messages = [messageObj1, messageObj2, messageObj3, messageObj4, messageObj5];
			}
		};
		
		
	  
		
	}//end of Ctrl	
})();
