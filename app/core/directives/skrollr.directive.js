(function(skrollr) {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrSkroller', egrSkroller);

	function egrSkroller() {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			skrollr.init().refresh();
		}

//        function controller($scope) {
//        	
//        }
	}
})(skrollr);
