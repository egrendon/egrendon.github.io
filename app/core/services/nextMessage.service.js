/**
 * Directive used to store a message to be displayed on the next page.
 */
(function() {
	'use strict';

	angular.module('myFirstApp.services').factory('nextMessageService', nextMessageService);

	nextMessageService.$inject = [ '$rootScope' ];

	function nextMessageService($rootScope) {
		var queue = [];
		var messageObj = null;

		$rootScope.$on('$stateChangeSuccess', function() {
			if (queue.length > 0)
				messageObj = queue.shift();
			else
				messageObj = null;
		});

		return {
			hasMsg : function () {
				return messageObj && messageObj.hasMsg();
			},
			
			set : function(aMessageObj) {
				if (aMessageObj instanceof MODEL.MessageObj)
					queue.push(aMessageObj);
				else
					throw new Error("The passed in param value must be of type MODEL.MessageObj");
			},
			get : function() {
				return messageObj;
			}
		};
	}
})();
