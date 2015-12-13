/**
 * Directive used to display messages.
 * 
 * Sample messages
 *             scope.alerts = [
 *                  { type: 'danger', msg: 'Oh snap! It's all bad.' },
 *                  { type: 'success', title: "Success!", msg: 'You did well.' },
 *                  { type: 'warning', msg: 'A genearl alert!' },
 *                  { type: 'info', msg: 'a blue message' },
 *                  { type: 'error', msg: 'No no! something bad happened' }
 *              ];
 * 
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('messagePanel', messagePanel);

    messagePanel.$inject = ['nextMessageService'];

    function messagePanel(nextMessageService) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "messageObj": "=",
                "messages": "=",
                "nextMessage": "="
            },
            template: '<div id="messagePanelId" class="clear messagePanel">' +
                '<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="close($index)">' +
                '<strong ng-if="alert.title">{{alert.title}}:&nbsp;&nbsp;</strong>{{alert.msg}}' +
                '</alert>' +
                '</div>',
            replace: true, //element to which the directive declared should be replaced with template
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            // initialize
            scope.alerts = [];

            /**
             * Method to close a message row
             */
            scope.close = function(index) {
                scope.alerts.splice(index, 1);
            };


            scope.$watch('messageObj', function(newValue, oldValue) {
                if (scope.messageObj && scope.messageObj.hasMsg()) {
                    // Push into alerts array
                    scope.alerts.push(scope.messageObj);
                }
            });

            scope.$watch('messages', function(newValue, oldValue) {
                if (scope.messages && scope.messages.length > 0) {
                    for (var i = 0; i < scope.messages.length; i++) {
                        var msgObj = scope.messages[i];
                        // Push into alerts array
                        scope.alerts.push(msgObj);
                    }
                }
            });

            scope.$watch('nextMessageService.get()', function(newValue, oldValue) {
                if (nextMessageService.get() && nextMessageService.hasMsg()) {
                    // Push into alerts array
                    scope.alerts.push(nextMessageService.get());
                }
            });
        }
    }
})();
