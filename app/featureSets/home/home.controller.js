(function() {
	'use strict';

	angular
		.module('myFirstApp.homeModule')
		.controller('HomeCtrlAs', HomeCtrlAs);

	HomeCtrlAs.$inject = ['homeService'];

	function HomeCtrlAs(homeService) {
		var vm = this;
		vm.resultData = null;
	
		vm.myAccountAction = function() {
			vm.resultData = homeService.getMyAccount(vm);
		};
		
		vm.getWeatherAction = function() {
			vm.resultData = homeService.getWeather(vm);
		};
		
		vm.saveWeatherAction = function() {
			vm.weatherModel = {status:"This is PUT angular", some:"angular something here"}; 
			vm.resultData = homeService.saveWeather(vm);
		};
		
	}//end of Ctrl	
})();
