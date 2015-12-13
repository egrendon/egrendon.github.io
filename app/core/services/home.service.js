(function() {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('homeService', homeService);

    homeService.$inject = ['myFirstBaseService'];

    function homeService(myFirstBaseService) {
        return {
        	getWeatherPromsie: function() {
        		return myFirstBaseService.weather.get().$promise;
        	},
        	
        	saveWeatherPromsie: function(vm) {
        		return myFirstBaseService.weather.save(vm.weatherModel).$promise;
        	},
        	
        	getMyAccountPromise: function() {
                return myFirstBaseService.myAccount.get().$promise;
            },

            getMyAccount: function(vm) {
            	this.getMyAccountPromise().then(function(response) {
                    if (response.succeeded) {
                        vm.resultData = response.data;
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
            
            getWeather: function(vm) {
            	this.getWeatherPromsie().then(function(response) {
                    if (response.succeeded) {
                        vm.resultData = response.data;
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
            
            saveWeather: function(vm) {
            	this.saveWeatherPromsie(vm).then(function(response) {
                    if (response.succeeded) {
                        vm.resultData = response.data;
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
