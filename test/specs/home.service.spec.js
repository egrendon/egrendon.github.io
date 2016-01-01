/*jshint -W030 */
describe('Billing Config Service', function() {
	var homeService;
	var mockRouteParams, mockVM, mockMyFirstBaseService;
	var spy_mockMyFirstBaseService;

	beforeEach(module('myFirstApp.services'));


 	/** Mock $stateParams **/
    beforeEach(function() {
        mockRouteParams = sinon.stub({
            someRouteCodes: '123,123,123'
        });
        module(function($provide) {
            $provide.value('$stateParams', mockRouteParams);
        });
    });

    /** Mock a VM controller **/
    beforeEach(function() {
        mockVM = {
            someValue: 55555555555555,
            anotherValue: 'sample1'
        };
    });


 	/** Mock myFirstBaseService **/
    beforeEach(function() {
        mockMyFirstBaseService = sinon.stub({
            myAccount: {
				get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
								return this;
							},
							catch: function(cb){
								cb(mockData);
								return this;
							}
						}
					};
				}
            }
        });
        module(function($provide) {
            $provide.value('myFirstBaseService', mockMyFirstBaseService);
        });
        spy_mockMyFirstBaseService = sinon.spy(mockMyFirstBaseService.myAccount, "get");
    });


    /** Inject service **/
	beforeEach(inject(function(_homeService_) {
		homeService = _homeService_;
	}));

	describe('Home Service', function() {

		it('should exist', function(){
			expect(homeService).to.exist;
		});

		it("should run someMethod() and return true", function() {
			var data = homeService.someMethod();
			expect(data).to.equal(true);
		});

		it("should run someCallBackAction(vm) and return true", function() {
			var data = homeService.someCallBackAction("someParma");
			expect(data).to.equal(true);
		});

	});

});
