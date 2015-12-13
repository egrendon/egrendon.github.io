(function() {
    'use strict';

    angular
        .module('myFirstApp.core')
        .constant('toastr', toastr)
		.constant('serviceConfigObject', {
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
