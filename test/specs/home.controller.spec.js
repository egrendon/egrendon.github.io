/*jshint -W030 */
describe('HomeCtrlAs Controller', function() {
	var controller;

	beforeEach(module('myFirstApp.homeModule'));

    beforeEach(function() {


		inject(function($controller, $rootScope, $location, $timeout) {
			newScope = $rootScope.$new();
			newLocation = $location;
			newTimeout = $timeout;

			controller = $controller("HomeCtrlAs", {

			});
		});

    });




	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('HomeCtrlAs', function() {

		it('should exist', function() {
			expect(controller).to.exist;
		});


	});

});
