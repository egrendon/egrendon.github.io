/**
 * This should be used to delcare all constants
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.core')
        //.constant('toastr', toastr)
		.constant('serviceConfigConstant', {
			'get': {
				method: 'GET',
				timeout: 120000
			}
		}, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
        
})();
