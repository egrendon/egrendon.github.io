(function() {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('homeService', homeService);

    homeService.$inject = ['myFirstBaseService'];

    function homeService(myFirstBaseService) {
        return {
        	someMethod: function() {
        		return true;
        	},
        	
        	someCallBackAction: function(vm) {
        		return true;
        	}
        };
    }
})();
