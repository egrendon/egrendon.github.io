/*jshint -W030 */
describe('Account Management New Controller', function() {
	var mockSce;
	var loadDataAction_Spy;
	var controller;
	
	beforeEach(module('agentApp.customerAccountServiceModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";
	});

	// mock $sce
	mockSce = {
		trustAsHtml: function(){return true;},
		trustAsResourceUrl: function(url){return url;}
	};
	module(function($provide){
		$provide.value('$sce', mockSce);
	});
	sceSpy = sinon.spy(mockSce, "trustAsHtml");
	
	

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller("AccountManagementNewCtrlAs", {
				$scope: newScope,
				$sce: mockSce,
				AGENCY_PORTAL_BASE_URL: "http:localhost:8080"
			});
		});

		inject(function($injector) {
			loadDataAction_Spy = sinon.spy(controller, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('AccountManagementNewCtrlAs', function() {

		it('check AccountManagementNewCtrlAs exists', function() {
			instantiateController();
			expect(controller).to.exist;
		});
		
		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(controller.isAgentUser).to.equal(true);
			expect(controller.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction once", function() {
			instantiateController();
			controller.loadDataAction();
			expect(loadDataAction_Spy).to.have.been.callCount(1);
			expect(controller.url).to.equal("http:localhost:8080/AgencyPortal?tab=newacct");
		});
	});

});

/*jshint -W030 */
describe('Account Management Search Controller', function() {
	var mockSce;
	var loadDataAction_Spy;
	var controller;
	
	beforeEach(module('agentApp.customerAccountServiceModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";
	});

	// mock $sce
	mockSce = {
		trustAsHtml: function(){return true;},
		trustAsResourceUrl: function(url){return url;}
	};
	module(function($provide){
		$provide.value('$sce', mockSce);
	});
	sceSpy = sinon.spy(mockSce, "trustAsHtml");
	
	

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller("AccountManagementSearchCtrlAs", {
				$scope: newScope,
				$sce: mockSce,
				AGENCY_PORTAL_BASE_URL: "http:localhost:8080"
			});
		});

		inject(function($injector) {
			loadDataAction_Spy = sinon.spy(controller, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('AccountManagementSearchCtrlAs', function() {

		it('check AccountManagementSearchCtrlAs exists', function() {
			instantiateController();
			expect(controller).to.exist;
		});
		
		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(controller.isAgentUser).to.equal(true);
			expect(controller.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction once", function() {
			instantiateController();
			controller.loadDataAction();
			expect(loadDataAction_Spy).to.have.been.callCount(1);
			expect(controller.url).to.equal("http:localhost:8080/AgencyPortal");
		});
	});

});

/*jshint -W030 */
describe('Agency Documents Controller', function() {
    var mockLocations, mockAgentDocuments, locationsSpy, documentsSpy;
    var mockLocationData, controller, loadDataActionSpy, locationsCallbackActionSpy;

    beforeEach(module('agentApp.agencyDocumentsModule'));

    beforeEach(function() {
        // add _userperms global
        window._userperms = {};
        _userperms.USERTYPE = "employee";
        _userperms.USERCLASS = "OMNIADMIN";
        _userperms.VIEW_AGENCY_USER_MGMT = "true";


        /** mock Locations service **/
        mockLocations = {
        	getLocationsPromise: function() {
                return {
                	then: function(callback) {
						callback(mockLocationData);
                        return this;
					},
                	catch: function(callback) {
                        return this;
					}
                };
            },
        	getLocationsThenCallback: function(vm) {
                return true;
            }
        };
        module(function($provide) {
            $provide.value('locations', mockLocations);
        });
        locationsSpy = sinon.spy(mockLocations, "getLocationsThenCallback");


        /** mock Documents service **/
        mockAgentDocuments = {
            getAgentMetadata: function(vm) {
                return [{"id":"321YZ3L_00B5Y5BL3000022","name":"Policy Correspondence","fileType":"pdf","documentType":"ALOSS","accountNumber":null,"policyNumber":null,"creationTime":"2015-03-19 16:01:56","createdBy":"import.agent","agencyCode":"107-004-0001"},{"id":"321YZ3L_00B5Y5BL300002M","name":"Policy Correspondence","fileType":"pdf","documentType":"ALOSS","accountNumber":null,"policyNumber":null,"creationTime":"2015-03-19 16:01:56","createdBy":"import.agent","agencyCode":"107-004-0003"}];
            },
            processAgentMetadataList: function(vm) {
            	return true;
            }
        };
        module(function($provide) {
            $provide.value('agentDocuments', mockAgentDocuments);
        });
        documentsSpy = sinon.spy(mockAgentDocuments, "getAgentMetadata");


        /** Provide Documents constant **/
        module(function($provide) {
            $provide.value("DOC_TYPE_AGENT_LOSS", "ALOSS");
        });

        /**
         * Method will create the Controller and controller spy
         */
        inject(function($injector) {
            controller = $injector.get('$controller')('AgencyDocumentsCtrlAs');
            loadDataActionSpy = sinon.spy(controller, "loadDataAction");
            locationsCallbackActionSpy = sinon.spy(controller, "locationsCallbackAction");
            mockLocationData = [{"locationCode":"107-004-0001","locationName":"Brown & Brown of Arizona, Inc. (Prescott)"},{"locationCode":"107-004-0003","locationName":"Brown & Brown of Arizona, Inc. (Phoenix 2)"}];
        });
    });



	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
    describe('AgencyDocumentsCtrlAs', function() {

        it('should have the AgencyDocuments controller', function() {
            expect(controller).to.exist;
        });

        it("controller should set message if succeeded is false", function() {
            controller.loadDataAction();
            expect(controller.message).to.equal(undefined);
        });

        it("controller should run loadDataAction and call service", function() {
            controller.loadDataAction();
            expect(loadDataActionSpy).to.have.been.callCount(1);
            expect(locationsSpy).to.have.been.callCount(1);
        });

        it("controller should run locationsCallbackAction once", function() {
            controller.locationsCallbackAction();
            expect(loadDataActionSpy).to.have.been.callCount(0);
            expect(locationsCallbackActionSpy).to.have.been.callCount(1);
        });


        it("controller have a docType of ALOSS", function() {
            controller.loadDataAction();
            expect(loadDataActionSpy).to.have.been.callCount(1);
			expect(controller.path).to.equal("/agency-documents/");
            expect(controller.docTypes).to.equal("ALOSS");
        });

    });

});

/*jshint -W030 */
describe('Agent Account Document Metadata Service', function() {
	var mockData,
	mockDocumentData,
	serviceSpy,
	cbSpy,
	mockVM,
	agentAccountDocumentMetadata;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		mockDocumentData = sinon.stub({
				getAccountDocumentMetadata: {
					get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('documentData', mockDocumentData);
		});
		serviceSpy = sinon.spy(mockDocumentData.getAccountDocumentMetadata, "get");

		cbSpy = sinon.spy({cb: function(){return true;}}, "cb");
		mockVM ={
			accountId: 5000000001,
			accountDocTypes: 'sample1,sample2'
		};

		inject(function(_agentAccountDocumentMetadata_) {
			agentAccountDocumentMetadata = _agentAccountDocumentMetadata_;
		});

	});

	describe('Agent Account Document Metadata Service', function() {

		describe("getAgentAccountDocumentMetadata()", function() {

			it("should call fulfillment function", function() {
				agentAccountDocumentMetadata.getAgentAccountDocumentMetadata(mockVM,cbSpy);
				expect(cbSpy).to.have.been.callCount(1);
			});

		});

		describe("getMetadata()", function() {

			it("should call documentData angular service", function() {
				mockData = sinon.stub({
					succeeded: true,
					data: [],
					message: "Success"
				});
				agentAccountDocumentMetadata.getMetadata(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				agentAccountDocumentMetadata.getMetadata(mockVM);
				expect(mockVM.message.msg).to.equal('Error message');
				expect(mockVM.contentLoaded).to.be.true;

			});

		});

	});

});
/*jshint -W030 */
describe('Agent Alerts Service', function() {
	var accountAlerts,
		sampleAlerts,
		newCustomers,
		pendingRenewal,
		pendingCancellation,
		findAlertType,
		mockLocalStorage,
		localStorageSpy;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		sampleAlerts = [{"date":"11/30/2015","time":"10:35:41 AM","guid":"2525c4b5-fa12-46cc-ba9a-477e2ca8b558","ngShow":true,"accounts":[{"type":"renewal","accounts":["5000013129","5000010979"]}]},{"date":"11/25/2015","time":"2:15:47 PM","guid":"f9f4b100-ffcb-435e-863c-53ad1b2d793c","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/21/2015","time":"2:15:26 PM","guid":"fc8232d7-9ebc-4779-bb30-d6de9fa3eb2c","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/20/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/19/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/18/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/17/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]}];
		newCustomers = ["5000101","5000102"];
		pendingRenewal = ["5000103","5000104"];
		pendingCancellation = ["5000105","5000106"];
		findAlertType = function(accounts, alertType){
			"use strict";
			var result = false;
			for (var i=0; i < accounts.length; i++) {
				var account = accounts[i];
				if (account.type === alertType) {
					result = true;
					break;
				}
			}
			return result;
		};

		mockLocalStorage = {
			$default: function(){
				this.alerts = [];
				return true;
			},
			alerts: []
		};
		module(function($provide){
			$provide.value('$localStorage', mockLocalStorage);
		});
		localStorageSpy = sinon.spy(mockLocalStorage, "$default");

		inject(function(_accountAlerts_) {
			accountAlerts = _accountAlerts_;
		});

	});

	describe("process()", function() {
		it("should add the alerts if an alert is not found for today", function() {
			var today = new Date("11/25/2015");
			accountAlerts.process(newCustomers, pendingRenewal, pendingCancellation, today);
			expect(mockLocalStorage.alerts.length).to.equal(1);
		});
		it("should not add the alerts if an alert is found for today", function() {
			var today = new Date("11/25/2015");
			mockLocalStorage.alerts = sampleAlerts;
			accountAlerts.process(newCustomers, pendingRenewal, pendingCancellation, today);
			expect(mockLocalStorage.alerts.length).to.equal(5);
		});
		it("should not add alerts if no alerts are passed in", function() {
			var today = new Date("11/29/2015");
			mockLocalStorage.alerts = sampleAlerts;
			accountAlerts.process([], [], [], today);
			expect(mockLocalStorage.alerts.length).to.equal(5);
		});
	});

	describe("searchDates()", function() {
		it("should return true if found", function() {
			var result = accountAlerts.searchDates("11/25/2015", sampleAlerts);
			expect(result).to.equal(true);
		});
		it("should return false if not found", function() {
			var result = accountAlerts.searchDates("1/1/2015", sampleAlerts);
			expect(result).to.equal(false);
		});
		it("should return alert object if found and return type is set to object", function() {
			var result = accountAlerts.searchDates("11/25/2015", sampleAlerts, 'object');
			expect(result).to.be.an('object');
			expect(result.date).to.equal("11/25/2015");
		});
		it("should return empty object if not found and return type is set to object", function() {
			var result = accountAlerts.searchDates("1/1/2015", sampleAlerts, 'object');
			expect(result).to.be.an('object');
			expect(result.hasOwnProperty('date')).to.equal(false);
		});
	});

	describe("getAlerts()", function() {
		it("should return an empty array on first run", function() {
			delete mockLocalStorage.alerts;
			var result = accountAlerts.getAlerts();
			expect(result).to.be.an('array');
			expect(result.length).to.equal(0);
		});
		it("should return an unfiltered array", function() {
			mockLocalStorage.alerts = sampleAlerts;
			var result = accountAlerts.getAlerts();
			expect(result).to.be.an('array');
			expect(result.length).to.equal(7);
		});
	});

	describe("getAlertsFiltered()", function() {
		it("should a filtered array", function() {
			mockLocalStorage.alerts = [{"date":"11/30/2015","time":"10:35:41 AM","guid":"2525c4b5-fa12-46cc-ba9a-477e2ca8b558","ngShow":false,"accounts":[{"type":"renewal","accounts":["5000013129","5000010979"]}]},{"date":"11/25/2015","time":"2:15:47 PM","guid":"f9f4b100-ffcb-435e-863c-53ad1b2d793c","ngShow":false,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/21/2015","time":"2:15:26 PM","guid":"fc8232d7-9ebc-4779-bb30-d6de9fa3eb2c","ngShow":false,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/20/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/19/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/18/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/17/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]}];
			var result = accountAlerts.getAlertsFiltered();
			expect(result).to.be.an('array');
			expect(result.length).to.equal(4);
		});
	});

	describe("getAlertsNewCustomersToday()", function() {
		it("should return an array of accounts for matching date", function() {
			var today = new Date("11/25/2015");
			mockLocalStorage.alerts = sampleAlerts;
			var result = accountAlerts.getAlertsNewCustomersToday(today);
			expect(result).to.be.an('array');
			expect(result).to.deep.equal(["5000101","5000102"]);
			expect(result.length).to.equal(2);
		});
		it("should return an empty array if there is no matching date", function() {
			var today = new Date("1/1/2015");
			mockLocalStorage.alerts = sampleAlerts;
			var result = accountAlerts.getAlertsNewCustomersToday(today);
			expect(result).to.be.an('array');
			expect(result.length).to.equal(0);
		});
	});

	describe("addAlert()", function() {
		it("should add all alert types when passed in", function() {
			var today = new Date();
			accountAlerts.addAlert(today, newCustomers, pendingRenewal, pendingCancellation);
			var foundNew = findAlertType(mockLocalStorage.alerts[0].accounts, 'new');
			var foundRenewal = findAlertType(mockLocalStorage.alerts[0].accounts, 'renewal');
			var foundCancellation = findAlertType(mockLocalStorage.alerts[0].accounts, 'cancellation');
			expect(foundNew && foundRenewal && foundCancellation).to.equal(true);
		});
		it("should only add 'new' alert type and not others", function() {
			var today = new Date();
			accountAlerts.addAlert(today, newCustomers, [], []);
			var foundNew = findAlertType(mockLocalStorage.alerts[0].accounts, 'new');
			var foundRenewal = findAlertType(mockLocalStorage.alerts[0].accounts, 'renewal');
			var foundCancellation = findAlertType(mockLocalStorage.alerts[0].accounts, 'cancellation');
			expect(foundNew ).to.equal(true);
			expect(foundRenewal && foundCancellation).to.equal(false);
		});
		it("should only add 'renewal' alert type and not others", function() {
			var today = new Date();
			accountAlerts.addAlert(today, [], pendingRenewal, []);
			var foundNew = findAlertType(mockLocalStorage.alerts[0].accounts, 'new');
			var foundRenewal = findAlertType(mockLocalStorage.alerts[0].accounts, 'renewal');
			var foundCancellation = findAlertType(mockLocalStorage.alerts[0].accounts, 'cancellation');
			expect(foundRenewal).to.equal(true);
			expect(foundNew && foundCancellation).to.equal(false);
		});
		it("should only add 'cancellation' alert type and not others", function() {
			var today = new Date();
			accountAlerts.addAlert(today, [], [], pendingCancellation);
			var foundNew = findAlertType(mockLocalStorage.alerts[0].accounts, 'new');
			var foundRenewal = findAlertType(mockLocalStorage.alerts[0].accounts, 'renewal');
			var foundCancellation = findAlertType(mockLocalStorage.alerts[0].accounts, 'cancellation');
			expect(foundCancellation).to.equal(true);
			expect(foundNew && foundRenewal).to.equal(false);
		});
	});

	describe("trimAlerts()", function() {
		it("should trim alerts outside of max range", function() {
			mockLocalStorage.alerts = [{"date":"11/30/2015","time":"10:35:41 AM","guid":"2525c4b5-fa12-46cc-ba9a-477e2ca8b558","ngShow":true,"accounts":[{"type":"renewal","accounts":["5000013129","5000010979"]}]},{"date":"11/29/2015","time":"10:35:41 AM","guid":"2525c4b5-fa12-46cc-ba9a-477e2ca8b558","ngShow":true,"accounts":[{"type":"renewal","accounts":["5000013129","5000010979"]}]},{"date":"11/28/2015","time":"10:35:41 AM","guid":"2525c4b5-fa12-46cc-ba9a-477e2ca8b558","ngShow":true,"accounts":[{"type":"renewal","accounts":["5000013129","5000010979"]}]},{"date":"11/25/2015","time":"2:15:47 PM","guid":"f9f4b100-ffcb-435e-863c-53ad1b2d793c","ngShow":false,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/21/2015","time":"2:15:26 PM","guid":"fc8232d7-9ebc-4779-bb30-d6de9fa3eb2c","ngShow":false,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/20/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/19/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/18/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]},{"date":"11/17/2015","time":"2:14:27 PM","guid":"a100ced7-360d-4347-b2da-d558702a65bd","ngShow":true,"accounts":[{"type":"new","accounts":["5000101","5000102"]},{"type":"renewal","accounts":["5000103","5000104"]},{"type":"cancellation","accounts":["5000105","5000106"]}]}];
			accountAlerts.trimAlerts(new Date("11/30/2015"));
			expect(mockLocalStorage.alerts.length).to.equal(3);
		});
	});

	describe("hideAlert()", function() {
		it("should change the value of ngShow to false for the specified array index", function() {
			mockLocalStorage.alerts = sampleAlerts;
			accountAlerts.hideAlert(0);
			expect(mockLocalStorage.alerts[0].ngShow).to.equal(false);
		});
	});

	describe("createGuid()", function() {
		it("should return a 36 character string that is a valid GUID", function() {
			var guid = accountAlerts.createGuid();
			var isValidGUID = ((guid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) ? true : false);
			expect(guid).to.be.a('string');
			expect(guid.length).to.equal(36);
			expect(isValidGUID).to.equal(true);
		});
	});

});

/*jshint -W030 */
describe('Agent Customer Document Accounts Service', function() {
	var mockData, mockDocumentData, serviceSpy, cbSpy, mockVM, agentCustomerDocumentAccounts;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		mockDocumentData = sinon.stub({
				getAgentAccounts: {
					get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('documentData', mockDocumentData);
		});
		serviceSpy = sinon.spy(mockDocumentData.getAgentAccounts, "get");

		cbSpy = sinon.spy({cb: function(){return true;}}, "cb");
		mockVM ={};

		module(function($provide){
			$provide.value('_', window._);
		});

		inject(function(_agentCustomerDocumentAccounts_) {
			agentCustomerDocumentAccounts = _agentCustomerDocumentAccounts_;
		});

	});

	describe('Agent Customer Document Accounts Service', function() {

		describe("getAgentCustomerDocumentAccounts()", function() {

			it("should call fulfillment function", function() {
				agentCustomerDocumentAccounts.getAgentCustomerDocumentAccounts({agencyCodes: 101},cbSpy);
				expect(cbSpy).to.have.been.callCount(1);
			});

		});

		describe("landing()", function() {

			it("should call documentData angular service if agencyCodes is present", function() {
				mockData = sinon.stub({
					succeeded: true,
					data: [],
					message: "Success"
				});
				mockVM.agencyCodes = 101;
				agentCustomerDocumentAccounts.landing(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

			it("should not call documentData angular service if agencyCodes is not present", function() {
				agentCustomerDocumentAccounts.landing(mockVM);
				expect(serviceSpy).to.have.been.callCount(0);
				expect(mockVM.message.msg).to.equal('Unable to find location code.');
				expect(mockVM.contentLoaded).to.be.true;
			});

			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				mockVM.agencyCodes = 101;
				agentCustomerDocumentAccounts.landing(mockVM);
				expect(mockVM.message.msg).to.equal('Error message');
				expect(mockVM.contentLoaded).to.be.true;

			});

		});

	});

});
/*jshint -W030 */
describe('Agent Customer Document Policies Service', function() {
	var mockData,
	mockDocumentData,
	serviceSpy,
	mockPolicyMetadata,
	policyMetadataSpy,
	cbSpy,
	mockVM,
	agentCustomerDocumentPolicies;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		mockDocumentData = sinon.stub({
				getAccountPolicies: {
					get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('documentData', mockDocumentData);
		});
		serviceSpy = sinon.spy(mockDocumentData.getAccountPolicies, "get");

		mockPolicyMetadata = {
			getMetadata: function(vm){
				return true;
			}
		};
		policyMetadataSpy = sinon.spy(mockPolicyMetadata, "getMetadata");

		cbSpy = sinon.spy({cb: function(){return true;}}, "cb");
		mockVM ={
			accountId: 5000000001,
			agencyCodes: 'sample1,sample2'
		};

		inject(function(_agentCustomerDocumentPolicies_, $q) {
			agentCustomerDocumentPolicies = _agentCustomerDocumentPolicies_;
			$q = $q;
		});

	});

	describe('Agent Customer Document Policies Service', function() {

		describe("getAgentCustomerDocumentPolicies()", function() {

			it("should return then()", function() {
				var promiseReturn = agentCustomerDocumentPolicies.getAgentCustomerDocumentPolicies(mockVM);
				expect(promiseReturn).to.include.keys('then');
			});

		});

		describe("getPoliciesAndPeriods()", function() {

			it("should call documentData angular service then set values for selectedPeriod and term", function() {
				mockData = sinon.stub({
					succeeded: true,
					data: {
						guidewireAccount: {
							accountName: 'sample'
						},
						policies:[{
							policyNumber: 10001,
							policyPeriods: [{term: 'abc123'}]
						}]
					},
					message: "Success"
				});
				mockVM.selectedPolicy = {};
				mockVM.selectedPolicy.policyNumber = 10001;
				mockVM.selectedPolicy.policyPeriods = [{term: 'abc123'}];
				agentCustomerDocumentPolicies.getPoliciesAndPeriods(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.selectedPeriod).to.be.an('object');
				expect(mockVM.term).to.equal('abc123');
			});

			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				agentCustomerDocumentPolicies.getPoliciesAndPeriods(mockVM, mockPolicyMetadata);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(policyMetadataSpy).to.have.been.callCount(0);
				expect(mockVM.message.msg).to.equal('Error message');

			});

		});

	});

});

/*jshint -W030 */
describe('Agent Customer Policies Service', function() {
	var mockData, mockAgentData, serviceSpy, cbSpy, cbData, mockVM, vmSpy, agentCustomerPolicies;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {

		mockAgentData = sinon.stub({
				getAgentCustomerPolicies: {
					get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
								return this;
							},
		                	catch: function(cb) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		serviceSpy = sinon.spy(mockAgentData.getAgentCustomerPolicies, "get");

		cbSpy = sinon.spy({cb: function(data){
			cbData = data;
			return true;
		}}, "cb");

		module(function($provide){
			$provide.value('_', window._);
		});
	});

	describe('Agent Customer Policies Service', function() {

		describe("getAgentCustomerPolicies()", function() {

			beforeEach(inject(function(_agentCustomerPolicies_) {
				agentCustomerPolicies = _agentCustomerPolicies_;
			}));

			it("should return then()", function() {
				var params = {
					accountId: 100001,
					agencyCodes: 101
				};
				var promiseReturn = agentCustomerPolicies.getAgentCustomerPolicies(params);
				expect(promiseReturn).to.include.keys('then');
			});

		});

		describe("account()", function() {

			beforeEach(function(){
				mockVM ={
					accountId: 100001,
					agencyCodes: 101,
					postLoadDataAction: cbSpy
				};
			});

			beforeEach(inject(function(_agentCustomerPolicies_) {
				agentCustomerPolicies = _agentCustomerPolicies_;
			}));

			//data.succeeded && data.data.policies.length > 0
			it("should call service and pass policies to postLoadDataAction() if policies > 0", function() {
				mockData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
				agentCustomerPolicies.account(mockVM);
				expect(cbData.policies).to.have.length.above(0);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(cbSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

			//data.succeeded && data.data.policies.length === 0
			it("should call service, not call postLoadDataAction() and return error message if policies = 0", function() {
				mockData = {
					"succeeded": true,
					"data": {"policies": []},
					"message": ""
				};
				agentCustomerPolicies.account(mockVM);
				expect(mockVM.message.msg).to.equal('We are currently unable to access policies for account 100001.  Please contact us at 1.800.231.1363 so that we can assist.');
				expect(serviceSpy).to.have.been.callCount(1);
				expect(cbSpy).to.have.been.callCount(0);
				expect(mockVM.contentLoaded).to.be.true;
			});

			//final else
			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				agentCustomerPolicies.account(mockVM);
				expect(mockVM.message.msg).to.equal('Error message');
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

		});

		describe("certsClaims()", function() {

			beforeEach(function(){
				mockVM ={
					accountId: 100001,
					agencyCodes: 101,
					applyPolicyPerms: cbSpy,
					applyCertificatePerms: cbSpy
				};
			});

			beforeEach(inject(function(_agentCustomerPolicies_) {
				agentCustomerPolicies = _agentCustomerPolicies_;
			}));

			//data.succeeded = true
			it("should call service and pass policies to applyPolicyPerms()", function() {
				mockData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
				agentCustomerPolicies.certsClaims(mockVM);
				expect(cbData.policies).to.have.length.above(0);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(cbSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

			//data.succeeded = true and certPerms = true
			it("should call service and pass policies to both applyPolicyPerms() and applyCertificatePerms() if certPerms = true", function() {
				mockData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
				mockVM.certPerms = true;
				agentCustomerPolicies.certsClaims(mockVM);
				expect(cbData.policies).to.have.length.above(0);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(cbSpy).to.have.been.callCount(2);
				expect(mockVM.contentLoaded).to.be.true;
			});

			//data.succeeded = false
			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				agentCustomerPolicies.certsClaims(mockVM);
				expect(mockVM.message.msg).to.equal('Error message');
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

		});


	});

});

/*jshint -W030 */
describe('Agent Customers Service', function() {
    var mockRouteParams, mockAgentData, mockAccountAlerts, mockVM, mockData;
    var agentData_getAgentCustomers_Spy,
		accountAlerts_process_Spy,
		accountAlerts_getAlertsFiltered_Spy,
		accountAlerts_getAlertsNewCustomersToday_Spy;
    var agentCustomers;

    beforeEach(module('agentApp.services'));


    beforeEach(function() {

        /** Mock $stateParams **/
        mockRouteParams = sinon.stub({
            agencyCodes: '107-004-0001,107-004-0002,107-004-0003'
        });
        module(function($provide) {
            $provide.value('$stateParams', mockRouteParams);
        });


        mockAgentData = sinon.stub({
            getAgentCustomers: {
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
            $provide.value('agentData', mockAgentData);
        });
        agentData_getAgentCustomers_Spy = sinon.spy(mockAgentData.getAgentCustomers, "get");


		mockAccountAlerts = {
			process: function(){
				"use strict";
				//
			},
			getAlertsFiltered: function(){
				"use strict";
				//
			},
			getAlertsNewCustomersToday: function(){
				"use strict";
				return ["5000101","5000102"];
			}
		};
		module(function($provide) {
			$provide.value('accountAlerts', mockAccountAlerts);
		});
		accountAlerts_process_Spy = sinon.spy(mockAccountAlerts, "process");
		accountAlerts_getAlertsFiltered_Spy = sinon.spy(mockAccountAlerts, "getAlertsFiltered");
		accountAlerts_getAlertsNewCustomersToday_Spy = sinon.spy(mockAccountAlerts, "getAlertsNewCustomersToday");


        /** Mock the controller **/
        mockVM = {
            accountId: 5000000001,
            accountDocTypes: 'sample1,sample2'
        };

        /** Inject service **/
        inject(function(_agentCustomers_) {
            agentCustomers = _agentCustomers_;
        });


        mockData = {"succeeded":true,"data":{"allCustomers":[{"customerID":"5000054321","customerName":"Sample Inc","policyInfo":[{"policyNumber":"1054321","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054322","customerName":"Sample LLC","policyInfo":[{"policyNumber":"1054322","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054323","customerName":"Sample Org","policyInfo":[{"policyNumber":"1054323","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false}],"newCustomers":["5000101","5000102"],"pendingRenewalCustomers":["5000103","5000104"],"pendingCancellationCustomers":["5000105","5000106"],"renewalPeriod":90},"message":"","cached":false};


    });



    /*******************************************************************************/
    /********************************* TESTS ***************************************/
    /*******************************************************************************/
    describe('getAgentCustomersList()', function() {

        it("should call getAgentCustomers(), process(), getAlertsFiltered() and getAlertsNewCustomersToday() once and agentCustomerArray should have a length", function() {
            agentCustomers.getAgentCustomersList(mockVM);
            expect(agentData_getAgentCustomers_Spy).to.have.been.callCount(1);
			expect(accountAlerts_process_Spy).to.have.been.callCount(1);
			expect(accountAlerts_getAlertsFiltered_Spy).to.have.been.callCount(1);
			expect(accountAlerts_getAlertsNewCustomersToday_Spy).to.have.been.callCount(1);
			expect(mockVM.agentCustomerArray.length).to.equal(3);
        });

		it("on second run, should call getAlertsFiltered() but not call getAgentCustomers(), process() and getAlertsNewCustomersToday() once and agentCustomerArray should have a length", function() {
			// simulate second call by pre-populating the dataArray
			agentCustomers.setDataArray(mockData.data.allCustomers);
			agentCustomers.getAgentCustomersList(mockVM);
			expect(agentData_getAgentCustomers_Spy).to.have.been.callCount(0);
			expect(accountAlerts_process_Spy).to.have.been.callCount(0);
			expect(accountAlerts_getAlertsFiltered_Spy).to.have.been.callCount(1);
			expect(accountAlerts_getAlertsNewCustomersToday_Spy).to.have.been.callCount(0);
			expect(mockVM.agentCustomerArray.length).to.equal(3);
		});

		it("on failure, should not process the service call", function() {
			mockData = {"succeeded":false,"data":null,"message":"failure message","cached":false};
			agentCustomers.getAgentCustomersList(mockVM);
			expect(agentData_getAgentCustomers_Spy).to.have.been.callCount(1);
			expect(accountAlerts_process_Spy).to.have.been.callCount(0);
			expect(accountAlerts_getAlertsFiltered_Spy).to.have.been.callCount(0);
			expect(accountAlerts_getAlertsNewCustomersToday_Spy).to.have.been.callCount(0);
		});

	});

	describe('basic setter and gettter tests for the setDataArray() and getDataArray methods', function() {
		it("should set null and verify outcome", function() {
			agentCustomers.setDataArray(null);
			var result = agentCustomers.getDataArray();
			expect(result).to.equal(null);
		});
		it("should set to value and verify outcome", function() {
			agentCustomers.setDataArray([{"customerID":"5000054321","customerName":"Sample Inc","policyInfo":[{"policyNumber":"1054321","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054322","customerName":"Sample LLC","policyInfo":[{"policyNumber":"1054322","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054323","customerName":"Sample Org","policyInfo":[{"policyNumber":"1054323","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false}]);
			var result = agentCustomers.getDataArray();
			expect(result).to.be.an('array');
			expect(result.length).to.equal(3);
		});
	});

	describe('basic setter and gettter tests for the setAccountFilterObj() and getAccountFilterObj() methods', function() {
		it("should set null and verify outcome", function() {
			agentCustomers.setAccountFilterObj(null);
			var result = agentCustomers.getAccountFilterObj();
			expect(result).to.equal(null);
		});
		it("should set to value and verify outcome", function() {
			agentCustomers.setAccountFilterObj({"accounts":["5000101","5000102"], "type":"renewal"});
			var result = agentCustomers.getAccountFilterObj();
			expect(result).to.be.notEmpty;
			expect(result.accounts).to.contain("5000101");
			expect(result.accounts).to.contain("5000102");
			expect(result.type).to.equal("renewal");
		});
	});

});

/*jshint -W030 */
describe('Agent Documents Service', function() {
    var mockRouteParams, mockDocumentData, mockVM, mockMetaData, mockLocation;
    var getMetadataFulfilled_Spy, getAgentMetadata_Spy;
    var agentDocumentsService;

    beforeEach(module('agentApp.services'));

    beforeEach(function() {

        // Provide mock $stateParams
        mockRouteParams = sinon.stub({
            docTypes: 'ALOSS',
            agencyCodes: '103'
        });
        module(function($provide) {
            $provide.value('$stateParams', mockRouteParams);
        });

        /** mock DocumentData service **/
        mockDocumentData = sinon.stub({
            getAgentMetadata: {
                get: function() {
                    return {
                        $promise: {
                            then: function(callback) {
                                callback(mockMetaData);
                            }
                        }
                    };
                }
            },
            processAgentMetadataList: function(vm) {
            	return true;
            }
        });
        /** Provide documentData service **/
        module(function($provide) {
            $provide.value('documentData', mockDocumentData);
        });
        //getAgentMetadataSpy = sinon.spy(mockDocumentData.getAgentMetadata, "get");



        /** Provide underscore service **/
        module(function($provide) {
            $provide.value('_', window._);
        });


        /**
         * Method will inject the AgentDocuments service
         */
        inject(function(_agentDocuments_) {
            agentDocumentsService = _agentDocuments_;
        });


        getMetadataFulfilled_Spy = sinon.spy(agentDocumentsService, "getMetadataFulfilled");
        getAgentMetadata_Spy = sinon.spy(agentDocumentsService, "getAgentMetadata");


        /** Empty Controler Values **/
        mockVM = {
            docTypes: 'ALOSS',
            agencyCodes: '111'
        };

        mockLocation = {
            "succeeded": true,
            "data": [{"locationCode":"107-004-0001","locationName":"Brown & Brown of Arizona, Inc. (Prescott)"},{"locationCode":"107-004-0003","locationName":"Brown & Brown of Arizona, Inc. (Phoenix 2)"}],
            "message": ""
        };
        mockMetaData = [{"id":"321YZ3L_00B5Y5BL3000022","name":"Policy Correspondence","fileType":"pdf","documentType":"ALOSS","accountNumber":null,"policyNumber":null,"creationTime":"2015-03-19 16:01:56","createdBy":"import.agent","agencyCode":"107-004-0001"},{"id":"321YZ3L_00B5Y5BL300002M","name":"Policy Correspondence","fileType":"pdf","documentType":"ALOSS","accountNumber":null,"policyNumber":null,"creationTime":"2015-03-19 16:01:56","createdBy":"import.agent","agencyCode":"107-004-0003"}];
    });






    /*******************************************************************************/
    /********************************* TESTS ***************************************/
    /*******************************************************************************/
    describe('TestSuite', function() {


        describe("getMetadataFulfilled()", function() {
            it("should call getMetadataFulfilled function once", function() {
                var localResponse = null;
                agentDocumentsService.getMetadataFulfilled(mockVM, function(response) {
                    localResponse = response;
                });
                expect(getMetadataFulfilled_Spy).to.have.been.callCount(1);
            });

            it("should call getMetadataFulfilled function once", function() {
                var localResponse = null;
                agentDocumentsService.getMetadataFulfilled(mockVM, function(response) {
                    localResponse = response;
                });
                expect(getMetadataFulfilled_Spy).to.have.been.callCount(1);
            });
        });

        describe("getAgentMetadata()", function() {
            it("should call getAgentMetadata function once", function() {
                agentDocumentsService.getAgentMetadata(mockVM);
                expect(mockVM.contentLoaded).to.equal(true);
                expect(getAgentMetadata_Spy).to.have.been.callCount(1);
            });
        });

    });

});

/*jshint -W030 */
describe('Agent Policy Term Document Metadata Service', function() {
	var mockData,
	mockDocumentData,
	serviceSpy,
	cbSpy,
	mockVM,
	mockDocMetadata,
	agentPolicyTermDocumentMetadata;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		mockDocumentData = sinon.stub({
			getPolicyTermDocumentMetadata: {
				get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
		                        return this;
							},
		                	catch: function(cb) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('documentData', mockDocumentData);
		});
		serviceSpy = sinon.spy(mockDocumentData.getPolicyTermDocumentMetadata, "get");

		cbSpy = sinon.spy({cb: function(){return true;}}, "cb");
		mockVM ={
			accountId: 5000000001,
			policyId: 10001,
			term: 'abc123',
			docTypes: 'sample1,sample2'
		};
		mockDocMetadata = [{id:"321YZ3K_00B5WKE2N00000F",name:"Policy Package",fileType:"PDF",documentType:"PPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"ZZ Sample 1",fileType:"PDF",documentType:"PPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"YY Sample 2",fileType:"PDF",documentType:"PPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"GG Sample 1",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"HH Sample 2",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"RR Sample 3",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"UU Sample 1",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"EE Sample 2",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"},{id:"321YZ3K_00B5WKE2N00000F",name:"LL Sample 3",fileType:"PDF",documentType:"PCPAKT",accountNumber:"5000014370",policyNumber:"1017052",creationTime:"2015-03-18 08:44:48",createdBy:"sv_gwpc_inow_pt"}];

		inject(function(_agentPolicyTermDocumentMetadata_) {
			agentPolicyTermDocumentMetadata = _agentPolicyTermDocumentMetadata_;
		});

	});

	describe('Agent Policy Term Document Metadata Service', function() {

		describe("getAgentPolicyTermDocumentMetadata()", function() {

			it("should return then()", function() {
				var promiseReturn = agentPolicyTermDocumentMetadata.getAgentPolicyTermDocumentMetadata(mockVM);
				expect(promiseReturn).to.include.keys('then');
			});

		});

		describe("getMetadata()", function() {

			it("should call documentData angular service", function() {
				mockData = sinon.stub({
					succeeded: true,
					data: mockDocMetadata,
					message: "Success"
				});
				agentPolicyTermDocumentMetadata.getMetadata(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
			});

			it("should set error message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				agentPolicyTermDocumentMetadata.getMetadata(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.message.msg).to.equal('Error message');
			});

		});

		describe("sortDocArray()", function() {

			it("should sort array passed in", function() {
				var arrayResult = agentPolicyTermDocumentMetadata.sortDocArray(mockDocMetadata, 'name');
				expect(arrayResult[0].name).to.equal('EE Sample 2');
				expect(arrayResult[1].name).to.equal('GG Sample 1');
				expect(arrayResult[2].name).to.equal('HH Sample 2');
			});

		});

	});

});

/*jshint -W030 */
describe('Billing Config Service', function() {

	beforeEach(module('agentApp.historyModule'));

	// get the billing config service and set it to the local var
	beforeEach(inject(function(_billingConfig_) {
		billingConfig = _billingConfig_;
	}));

	describe('Billing Config Service', function() {

		it('should exist', function(){
			expect(billingConfig).to.exist;
		});

		it("should run getOverrideOptions() and return an object", function() {
			var data = billingConfig.getOverrideOptions();
			expect(data).to.be.an('object');
		});

		it("should run getColumnDefs() and return an array", function() {
			var data = billingConfig.getColumnDefs();
			expect(data).to.be.an('array');
		});

	});

});

/*jshint -W030 */
describe('Billing Controller', function() {

	var $scope,
		mockStateParams,
		servicePromise,
		mockData,
		mockAgentCustomerPolicies,
		accountSpy,
		mockPaymentDueService,
		getPaymentSpy,
		mockHistoryService,
		getChargesHistorySpy,
		getPaymentsHistorySpy,
		mockBillingConfig,
		getBillingOverrideOptionsSpy,
		getBillingColumnDefsSpy,
		mockCreditConfig,
		getCreditOverrideOptionsSpy,
		getCreditColumnDefsSpy,
		mockCreditCardService,
		creditCardServiceSpy,
		mockPermsService,
		permsServiceSpy,
		mockFlashMessage;

	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockStateParams = sinon.stub({
			accountId: 1000000001,
			agencyCodes: '103',
			result: 'APPROVED'
		});
		// provide mockStateParams to the module as $stateParams
		module(function($provide){
			$provide.value('$stateParams', mockStateParams);
		});

		// shared service promise function
		servicePromise = function(){
			return {
				then: function(cb){
					cb(mockData);
					return this;
				},
				catch: function(cb) {
					cb(mockData);
					return this;
				}
			};
		};

		// mock agentCustomerPolicies
		mockAgentCustomerPolicies = {
			account: function(vm){
				return vm;
			}
		};
		// provide mockAgentCustomerPolicies to the module as agentCustomerPolicies
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		// spy on account()
		accountSpy = sinon.spy(mockAgentCustomerPolicies, "account");

		// mock paymentDueService
		mockPaymentDueService = {
			getPayment: function(vm){
				return vm;
			}
		};
		// provide mockPaymentDueService to the module as paymentDueService
		module(function($provide){
			$provide.value('paymentDueService', mockPaymentDueService);
		});
		// spy on getPayment()
		getPaymentSpy = sinon.spy(mockPaymentDueService, "getPayment");

		// mock history service
		mockHistoryService = {
			getChargesHistory: servicePromise,
			getPaymentsHistory: servicePromise
		};
		// provide mockHistoryService to the module as historyService
		module(function($provide){
			$provide.value('historyService', mockHistoryService);
		});
		// spy on getChargesHistoryPromise() and getPaymentsHistoryPromise()
		getChargesHistorySpy = sinon.spy(mockHistoryService, "getChargesHistory");
		getPaymentsHistorySpy = sinon.spy(mockHistoryService, "getPaymentsHistory");

		// mock billingConfig
		mockBillingConfig = {
			getOverrideOptions: function(){
				return true;
			},
			getColumnDefs: function(){
				return true;
			}
		};
		// provide mockBillingConfig to the module as billingConfig
		module(function($provide){
			$provide.value('billingConfig', mockBillingConfig);
		});
		// spy on getOverrideOptions() and getColumnDefs()
		getBillingOverrideOptionsSpy = sinon.spy(mockBillingConfig, "getOverrideOptions");
		getBillingColumnDefsSpy = sinon.spy(mockBillingConfig, "getColumnDefs");

		// mock creditConfig
		mockCreditConfig = {
			getOverrideOptions: function(){
				return true;
			},
			getColumnDefs: function(){
				return true;
			}
		};
		// provide mockCreditConfig to the module as creditConfig
		module(function($provide){
			$provide.value('creditConfig', mockCreditConfig);
		});
		// spy on getOverrideOptions() and getColumnDefs()
		getCreditOverrideOptionsSpy = sinon.spy(mockCreditConfig, "getOverrideOptions");
		getCreditColumnDefsSpy = sinon.spy(mockCreditConfig, "getColumnDefs");

		// mock creditCardService service
		mockCreditCardService = {
			setCreditCardMessage: function(vm){return true;}
		};
		// provide mockCreditCardService to the module as creditCardService
		module(function($provide){
			$provide.value('creditCardService', mockCreditCardService);
		});
		creditCardServiceSpy = sinon.spy(mockCreditCardService, "setCreditCardMessage");

		// mock permsService
		mockPermsService = {
			updatePermissions: function(vm){return vm;}
		};
		// provide mockPermsService to the module as permsService
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		// mock flashMessage
		mockFlashMessage = {};
		// provide mockFlashMessage to the module as flashMessage
		module(function($provide){
			$provide.value('flashMessage', mockFlashMessage);
		});

		inject(function($injector, $rootScope){
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('BillingCtrl', {
				$scope: $scope
			});
		});

	});

	describe('Billing Controller', function() {

		it('should exist', function() {
			expect(controller).to.exist;
		});

		it("should set userPerms to agent", function() {
			expect($scope.isAgentUser).to.equal(true);
			expect($scope.isCSRorOMNI).to.equal(false);
		});

		it("should run loadDataAction() and call account() from agentCustomerPolicies", function() {
			$scope.loadDataAction();
			expect(accountSpy).to.have.been.callCount(1);
		});

		it("should run postLoadDataAction(), call creditCardService then configure policy, customer and menu data", function() {
			var response = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
			mockData = {"succeeded":true,"data":{"amountDue":"0","amountPaid":null,"amountBilled":"0","amountUnbilled":null,"paymentStatus":null,"totalPastDue":"0"},"message":""};
			$scope.postLoadDataAction(response.data);
			// verify policy and customer data
			expect($scope.policies).to.be.an('array');
			expect($scope.customerName).to.equal("Fate Brewing");
			expect($scope.selectedPolicy).to.be.an('object');
			// verify menu data
			expect($scope.menu.accountId).to.equal(1000000001);
			expect($scope.menu.accountName).to.equal("Fate Brewing");
			expect($scope.menu.agencyCodes).to.equal("103");
			expect($scope.menu.role).to.be.an('object');
			// verify creditCardServiceSpy call
			expect(creditCardServiceSpy).to.have.been.callCount(1);
			// verify permsService and paymentDueService calls
			expect(permsServiceSpy).to.have.been.callCount(1);
			expect(getPaymentSpy).to.have.been.callCount(1);
			// verify showTable('billing') call
			//expect(getChargesHistorySpy).to.have.been.callCount(1);
			//expect(getPaymentsHistorySpy).to.have.been.callCount(0);
			//expect(getBillingOverrideOptionsSpy).to.have.been.callCount(1);
			//expect(getBillingColumnDefsSpy).to.have.been.callCount(1);
		});

		it("should run showTable() for billing history", function() {
			$scope.showTable('chargesHistory');
			expect(getChargesHistorySpy).to.have.been.callCount(1);
			expect(getPaymentsHistorySpy).to.have.been.callCount(0);
			expect(getBillingOverrideOptionsSpy).to.have.been.callCount(1);
			expect(getBillingColumnDefsSpy).to.have.been.callCount(1);
		});

		it("should run showTable() for credit history", function() {
			$scope.showTable('paymentsHistory');
			expect(getChargesHistorySpy).to.have.been.callCount(0);
			expect(getPaymentsHistorySpy).to.have.been.callCount(1);
			expect(getCreditOverrideOptionsSpy).to.have.been.callCount(1);
			expect(getCreditColumnDefsSpy).to.have.been.callCount(1);
		});

	});

});

/*jshint -W030 */
describe('Certificate Controller', function() {
	var $scope,
	$httpBackend,
	mockLocation,
	mockRouteParams,
	mockPermsService,
	mockFlashService,
	mockAgentData,
	mockCustomerPoliciesData,
	mockAgentCustomerPolicies,
	mockCertificatesData,
	locationSpy,
	permsServiceSpy,
	flashServiceSpy,
	agentCustomerPoliciesSpy,
	certificatesSpy,
	controller;

	beforeEach(module('agentApp.certificatesModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE="employee";
		_userperms.USERCLASS="OMNIADMIN";
		_userperms.VIEW_AGENCY_USER_MGMT="true";

		// mock $location
		mockLocation = {
			path: function(){return true;}
		};
		module(function($provide){
			$provide.value('$location', mockLocation);
		});
		locationSpy = sinon.spy(mockLocation, "path");

		// mock $stateParams
		mockRouteParams = sinon.stub({
			accountId: '1000000001',
			agencyCodes: '101',
			policyNumber: '1000001',
			policyPeriodId: 'pc:10001',
			certificateId: 7757663
		});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		// mock permsService
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		// mock flashMessage
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		flashServiceSpy = sinon.spy(mockFlashService, "set");

		// mock agentData
		mockCustomerPoliciesData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
		mockCertificatesData = {"succeeded":true,"data":[{"certificateId":7757663,"periodId":"pc:9701","holderId":6972522,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":6,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":true,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"scheduled","holder":{"holderId":6972522,"policyPeriodId":"pc:9701","name":"John's Comp","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-12-12T08:33:55","createdDate":"2014-12-05T12:14:19"},"classCodesAsText":"0005"},{"certificateId":7757655,"periodId":"pc:9701","holderId":6972514,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":5,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"123","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972514,"policyPeriodId":"pc:9701","name":"John DoE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:48:03","createdDate":"2014-11-25T14:48:03"},"classCodesAsText":"0005"},{"certificateId":7757654,"periodId":"pc:9701","holderId":6972513,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":4,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972513,"policyPeriodId":"pc:9701","name":"JOHN DOE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:47:23","createdDate":"2014-11-25T14:47:23"},"classCodesAsText":"0005"},{"certificateId":7757653,"periodId":"pc:9701","holderId":6972512,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":3,"revisionNumber":5,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972512,"policyPeriodId":"pc:9701","name":"jOHN dOe","careOfName":"","address":{"addressLine1":"156 E","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85016","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:18:41","createdDate":"2014-11-25T14:08:30"},"classCodesAsText":"0005"},{"certificateId":7757625,"periodId":"pc:9701","holderId":6972484,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":1,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"Phoenix, AZ","jobId":"12345","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972484,"policyPeriodId":"pc:9701","name":"CopperPoint test","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-10-22T17:23:16","createdDate":"2014-10-22T12:38:08"},"classCodesAsText":"0005"},{"certificateId":7757648,"periodId":"pc:9701","holderId":6972507,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":2,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972507,"policyPeriodId":"pc:9701","name":"J","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T13:47:50","createdDate":"2014-11-24T14:21:13"},"classCodesAsText":"0005"}],"message":""};
		mockAgentData = sinon.stub({
			getCertificates: {
				get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockCertificatesData);
		                        return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		certificatesSpy = sinon.spy(mockAgentData.getCertificates, "get");

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {certsClaims: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "certsClaims");

		inject(function($injector, $rootScope){
			$httpBackend = $injector.get('$httpBackend');
			$httpBackend.when('PUT', '/delegate/services/api/certificates')
				.respond({
					succeeded: true,
					data: {},
					message: "Success"
				});
			$httpBackend.when('GET', '/certificates-portlet/js/states.json')
				.respond([{ "name": "Arizona", "abbreviation": "AZ"}]);
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('CertificateCtrl', {
				$scope: $scope,
				_: window._
			});
		});
	});

	describe('CertificateCtrl', function() {

		it('should have the Certificate controller', function(){
			expect(controller).to.exist;
		});

		it("controller should run loadDataAction, call agentData service then run applyPolicyPerms and applyCertificatePerms", function() {
			/*
			This test runs the following chained functions:
			$scope.loadDataAction()
				loadCert()
				getPolicy()
					applyPolicyPerms()
						selectNamedInsured()
			*/
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$httpBackend.flush();
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
			expect(permsServiceSpy).to.have.been.callCount(1);
			expect(certificatesSpy).to.have.been.callCount(1);
		});

		it("someSelected returns true with an object that has keys", function() {
			var obj = {
				a: 1,
				b: 2,
				c: 3
			};
			expect($scope.someSelected(obj)).to.be.true;
		});

		it("someSelected returns false with an empty object", function() {
			var obj = {};
			expect($scope.someSelected(obj)).to.be.false;
		});

		it("processForm runs then calls flashMessage and $location", function() {
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$scope.certificate = mockCertificatesData.data[0];
			$scope.selectedState = {};
			$scope.selectedState.abbreviation = 'AZ';
			$scope.processForm(true);
			$httpBackend.flush();
			expect(flashServiceSpy).to.have.been.callCount(1);
			expect(locationSpy).to.have.been.callCount(1);
		});

		it ("isCertsSaveButtonEnable returns true when isCSRorOMNI is true", function() {
			$scope.isCSRorOMNI = true;
			$scope.certificateForm = {};
			$scope.certificateForm.$invalid = true;

			var role = {
				perm: {
					certsCreate:true,
					certsDelete:true
				}
			};

			$scope.role = role;
			expect($scope.isCertsSaveButtonEnable()).to.equal(true);
		});

	});

});

/*jshint -W030 */
describe('Certificates Controller', function() {
	var $scope,
	mockLocation,
	mockSce,
	mockRoute,
	mockRouteParams,
	mockPermsService,
	mockFlashService,
	mockAgentData,
	mockCustomerPoliciesData,
	mockAgentCustomerPolicies,
	mockCertificatesData,
	locationSpy,
	sceSpy,
	routeSpy,
	permsServiceSpy,
	flashServiceSpy,
	agentCustomerPoliciesSpy,
	certificatesSpy,
	controller;

	beforeEach(module('agentApp.certificatesModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE="employee";
		_userperms.USERCLASS="OMNIADMIN";
		_userperms.VIEW_AGENCY_USER_MGMT="true";

		// mock $location
		mockLocation = {
			path: function(){return true;}
		};
		module(function($provide){
			$provide.value('$location', mockLocation);
		});
		locationSpy = sinon.spy(mockLocation, "path");

		// mock $sce
		mockSce = {
			trustAsHtml: function(){return true;}
		};
		module(function($provide){
			$provide.value('$sce', mockSce);
		});
		sceSpy = sinon.spy(mockSce, "trustAsHtml");

		// mock $route
		mockRoute = {
			reload: function(){return true;}
		};
		module(function($provide){
			$provide.value('$route', mockRoute);
		});
		routeSpy = sinon.spy(mockRoute, "reload");

		// mock $stateParams
		mockRouteParams = sinon.stub({
			accountId: '1000000001',
			agencyCodes: '101',
			policyNumber: '1000001',
			policyPeriodId: 'pc:10001'
		});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		// mock permsService
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		// mock flashMessage
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		flashServiceSpy = sinon.spy(mockFlashService, "set");

		// mock agentData
		mockAgentData = sinon.stub({
			getCertificates: {
				get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockCertificatesData);
		                        return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		certificatesSpy = sinon.spy(mockAgentData.getCertificates, "get");

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {certsClaims: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "certsClaims");

		inject(function($injector, $rootScope){
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('CertificatesCtrl', {
				$scope: $scope,
				_: window._
			});
		});
	});

	describe('CertificatesCtrl', function() {

		it('should have the Certificates controller', function(){
			expect(controller).to.exist;
		});

		it("controller should run loadDataAction, call agentData service then run applyPolicyPerms and applyCertificatePerms", function() {
			mockCustomerPoliciesData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
			mockCertificatesData = {"succeeded":true,"data":[{"certificateId":7757663,"periodId":"pc:9701","holderId":6972522,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":6,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":true,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"scheduled","holder":{"holderId":6972522,"policyPeriodId":"pc:9701","name":"John's Comp","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-12-12T08:33:55","createdDate":"2014-12-05T12:14:19"},"classCodesAsText":"0005"},{"certificateId":7757655,"periodId":"pc:9701","holderId":6972514,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":5,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"123","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972514,"policyPeriodId":"pc:9701","name":"John DoE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:48:03","createdDate":"2014-11-25T14:48:03"},"classCodesAsText":"0005"},{"certificateId":7757654,"periodId":"pc:9701","holderId":6972513,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":4,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972513,"policyPeriodId":"pc:9701","name":"JOHN DOE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:47:23","createdDate":"2014-11-25T14:47:23"},"classCodesAsText":"0005"},{"certificateId":7757653,"periodId":"pc:9701","holderId":6972512,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":3,"revisionNumber":5,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972512,"policyPeriodId":"pc:9701","name":"jOHN dOe","careOfName":"","address":{"addressLine1":"156 E","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85016","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:18:41","createdDate":"2014-11-25T14:08:30"},"classCodesAsText":"0005"},{"certificateId":7757625,"periodId":"pc:9701","holderId":6972484,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":1,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"Phoenix, AZ","jobId":"12345","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972484,"policyPeriodId":"pc:9701","name":"CopperPoint test","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-10-22T17:23:16","createdDate":"2014-10-22T12:38:08"},"classCodesAsText":"0005"},{"certificateId":7757648,"periodId":"pc:9701","holderId":6972507,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":2,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972507,"policyPeriodId":"pc:9701","name":"J","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T13:47:50","createdDate":"2014-11-24T14:21:13"},"classCodesAsText":"0005"}],"message":""};
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$scope.applyCertificatePerms(mockCustomerPoliciesData.data);
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
			expect(permsServiceSpy).to.have.been.callCount(1);
			expect(certificatesSpy).to.have.been.callCount(1);
		});

		it("updatePolicy should call $location.path()", function() {
			mockCustomerPoliciesData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
			mockCertificatesData = {"succeeded":true,"data":[{"certificateId":7757663,"periodId":"pc:9701","holderId":6972522,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":6,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":true,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"scheduled","holder":{"holderId":6972522,"policyPeriodId":"pc:9701","name":"John's Comp","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-12-12T08:33:55","createdDate":"2014-12-05T12:14:19"},"classCodesAsText":"0005"},{"certificateId":7757655,"periodId":"pc:9701","holderId":6972514,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":5,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"123","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972514,"policyPeriodId":"pc:9701","name":"John DoE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:48:03","createdDate":"2014-11-25T14:48:03"},"classCodesAsText":"0005"},{"certificateId":7757654,"periodId":"pc:9701","holderId":6972513,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":4,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972513,"policyPeriodId":"pc:9701","name":"JOHN DOE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:47:23","createdDate":"2014-11-25T14:47:23"},"classCodesAsText":"0005"},{"certificateId":7757653,"periodId":"pc:9701","holderId":6972512,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":3,"revisionNumber":5,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972512,"policyPeriodId":"pc:9701","name":"jOHN dOe","careOfName":"","address":{"addressLine1":"156 E","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85016","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:18:41","createdDate":"2014-11-25T14:08:30"},"classCodesAsText":"0005"},{"certificateId":7757625,"periodId":"pc:9701","holderId":6972484,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":1,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"Phoenix, AZ","jobId":"12345","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972484,"policyPeriodId":"pc:9701","name":"CopperPoint test","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-10-22T17:23:16","createdDate":"2014-10-22T12:38:08"},"classCodesAsText":"0005"},{"certificateId":7757648,"periodId":"pc:9701","holderId":6972507,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":2,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972507,"policyPeriodId":"pc:9701","name":"J","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T13:47:50","createdDate":"2014-11-24T14:21:13"},"classCodesAsText":"0005"}],"message":""};
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$scope.applyCertificatePerms(mockCustomerPoliciesData.data);
			$scope.updatePolicy();
			expect(locationSpy).to.have.been.callCount(1);
		});

		it("updatePolicyPeriod should call $location.path()", function() {
			mockCustomerPoliciesData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
			mockCertificatesData = {"succeeded":true,"data":[{"certificateId":7757663,"periodId":"pc:9701","holderId":6972522,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":6,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":true,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"scheduled","holder":{"holderId":6972522,"policyPeriodId":"pc:9701","name":"John's Comp","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-12-12T08:33:55","createdDate":"2014-12-05T12:14:19"},"classCodesAsText":"0005"},{"certificateId":7757655,"periodId":"pc:9701","holderId":6972514,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":5,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"123","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972514,"policyPeriodId":"pc:9701","name":"John DoE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:48:03","createdDate":"2014-11-25T14:48:03"},"classCodesAsText":"0005"},{"certificateId":7757654,"periodId":"pc:9701","holderId":6972513,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":4,"revisionNumber":1,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972513,"policyPeriodId":"pc:9701","name":"JOHN DOE","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:47:23","createdDate":"2014-11-25T14:47:23"},"classCodesAsText":"0005"},{"certificateId":7757653,"periodId":"pc:9701","holderId":6972512,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":3,"revisionNumber":5,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972512,"policyPeriodId":"pc:9701","name":"jOHN dOe","careOfName":"","address":{"addressLine1":"156 E","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85016","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T14:18:41","createdDate":"2014-11-25T14:08:30"},"classCodesAsText":"0005"},{"certificateId":7757625,"periodId":"pc:9701","holderId":6972484,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":1,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"Phoenix, AZ","jobId":"12345","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":false,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972484,"policyPeriodId":"pc:9701","name":"CopperPoint test","careOfName":"","address":{"addressLine1":"3030 N 3rd Street","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"USA"},"email":"","modifiedDate":"2014-10-22T17:23:16","createdDate":"2014-10-22T12:38:08"},"classCodesAsText":"0005"},{"certificateId":7757648,"periodId":"pc:9701","holderId":6972507,"policyNumber":"1000001","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","certificateNumber":2,"revisionNumber":2,"displayName":"Waiver of Sub Test","description":"description","location":"","jobId":"","addendum":null,"classCodes":["0005"],"offDutyOfficer":false,"subWaiver":false,"subWaiverFull":false,"subWaiverSched":false,"endeavorToCancel":false,"renew":true,"showInCareOf":true,"addressOnBack":false,"modifiedDate":null,"creationDate":null,"deleted":false,"deletionDate":null,"hostSystem":"GW","subWaiverConsumer":"blanket","holder":{"holderId":6972507,"policyPeriodId":"pc:9701","name":"J","careOfName":"ATTN","address":{"addressLine1":"123 address","addressLine2":"","city":"Phoenix","state":"AZ","postalCode":"85028","county":"","country":"USA"},"email":"","modifiedDate":"2014-11-25T13:47:50","createdDate":"2014-11-24T14:21:13"},"classCodesAsText":"0005"}],"message":""};
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$scope.applyCertificatePerms(mockCustomerPoliciesData.data);
			$scope.updatePolicyPeriod();
			expect(locationSpy).to.have.been.callCount(1);
		});

		describe("Selected Cert Actions", function() {

			beforeEach(function(){
				$('<div id="sampleCheckboxs"><input value="7757663" class="cert" type="checkbox" checked><input value="7757655" class="cert" type="checkbox" checked><input value="7757654" class="cert" type="checkbox"><input value="7757625" class="cert" type="checkbox"><input value="7757648" class="cert" type="checkbox"></div>').appendTo('body');
				this.xhr = sinon.useFakeXMLHttpRequest();
				var requests = this.requests = [];
				this.xhr.onCreate = function (xhr) {
					requests.push(xhr);
				};
			});

			afterEach(function(){
				$('#sampleCheckboxs').remove();
				this.xhr.restore();
			});

			it ("selectedCerts returns an array with two certs", function() {
				var certs = $scope.selectedCerts();
				expect(certs).to.be.an('array');
				expect(certs.length).to.equal(2);
			});

			it ("deleteCertificate runs twice then calls flashMessage and $route", function() {
				$scope.deleteCertificate();
				expect(this.requests.length).to.equal(2);
				expect(flashServiceSpy).to.have.been.callCount(1);
				expect(routeSpy).to.have.been.callCount(1);
			});

			/*
			$scope.downloadCertificate can not be tested due to
			numerous DOM dependiencies required by data table
			it ("downloadCertificate", function() {
				//
			});
			*/

			it ("deleteConfirmMsg should return a message with two records.", function() {
				$scope.selectedCerts();
				var result = $scope.deleteConfirmMsg();
				var expectedResult = "Are you sure you want to delete the '2' selected records?";
				expect(result).to.equal(expectedResult);
			});

			it ("isCertsCreateButtonEnable returns true when isCSRorOMNI is true", function() {
				$scope.isCSRorOMNI = true;
				var role = {
					perm: {
						certsCreate:true,
						certsDelete:true
					}
				};
				$scope.role = role;
				expect($scope.isCertsCreateButtonEnable()).to.equal(true);
			});

			it ("isCertsDeleteButtonEnable returns true when isCSRorOMNI is true", function() {
				$scope.isCSRorOMNI = true;
				var role = {
					perm: {
						certsCreate:true,
						certsDelete:true
					}
				};
				$scope.role = role;
				expect($scope.isCertsDeleteButtonEnable()).to.equal(true);
			});

		});

	});

});

/*jshint -W030 */
describe('Claims Controller', function() {
	var mockRouteParams, mockData, mockAgentData, mockPermsService, controller, mockAgentDataSpy, mockPermsServiceSpy, controllerSpy;

	beforeEach(module('agentApp.claimsModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE="employee";
		_userperms.USERCLASS="OMNIADMIN";
		_userperms.VIEW_AGENCY_USER_MGMT="true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '101'});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		// mock agentData
		mockAgentData = sinon.stub({
			getAgentCustomerPolicies: {
				get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
		                        return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		mockAgentDataSpy = sinon.spy(mockAgentData.getAgentCustomerPolicies, "get");


		// mock permsService
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		mockPermsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		inject(function($injector, $rootScope){
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('ClaimsCtrl', {
				$scope: $scope
			});
			controllerSpy = sinon.spy(controller, "loadDataAction");
		});

	});

	describe('ClaimsCtrl', function() {

		it('should have the Claims controller', function(){
			expect(controller).to.exist;
		});

		it("controller should run loadDataAction, call service then run applyPolicyPerms", function() {
			mockData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011295","policyType":"GW","ownerID":"5000011328","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":false,"CERTS_VIEW":false,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":false,"USER_MGMT":true,"CERTS_SAVE":false,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10501","status":"In Force","parentPolicyId":"1011295","effectiveDate":"2014-12-01T00:00:00","expirationDate":"2015-11-30T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 3rd Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Chocolate Factory","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0006","classCodeSuffix":null,"classCodeSuffixName":"FARM: ANIMAL RAISING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"},{"policyNumber":"1011294","policyType":"GW","ownerID":"5000011328","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":false,"CERTS_VIEW":false,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":false,"USER_MGMT":true,"CERTS_SAVE":false,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10405","status":"In Force","parentPolicyId":"1011294","effectiveDate":"2014-11-01T00:00:00","expirationDate":"2015-11-01T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 3rd Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Chocolate Factory","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011328","accountName":"Chocolate Factory","emailAddress":"","address":{"addressLine1":"30 N 3rd Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"Maricopa","country":"US"},"fein":null}},"message":""};
			controller.loadDataAction();
			expect(controllerSpy).to.have.been.callCount(1);
			expect(mockAgentDataSpy).to.have.been.callCount(1);
			expect(mockPermsServiceSpy).to.have.been.callCount(1);
		});

		it("controller should set message if succeeded is false and should not run applyPolicyPerms", function() {
			mockData = sinon.stub({
				succeeded: false,
				data: null,
				message: "Error message"
			});
			controller.loadDataAction();
			expect(controller.message.msg).to.equal('Error message');
			expect(mockPermsServiceSpy).to.have.been.callCount(0);
		});

	});

});

/*jshint -W030 */
describe('Credit Config Service', function() {

	beforeEach(module('agentApp.historyModule'));

	// get the credit config service and set it to the local var
	beforeEach(inject(function(_creditConfig_) {
		creditConfig = _creditConfig_;
	}));

	describe('Credit Config Service', function() {

		it('should exist', function(){
			expect(creditConfig).to.exist;
		});

		it("should run getOverrideOptions() and return an object", function() {
			var data = creditConfig.getOverrideOptions();
			expect(data).to.be.an('object');
		});

		it("should run getColumnDefs() and return an array", function() {
			var data = creditConfig.getColumnDefs();
			expect(data).to.be.an('array');
		});

	});

});

/*jshint -W030 */
describe('CreditCard Service', function() {
    var creditCardService;
    var mockData, mockVM;
    var mockStateParams, mockAgentDataService;
    var mockAgentData_getCCPaymentFormInfo_Spy;


    beforeEach(module('agentApp.services'));

    beforeEach(function() {

        /** mock $stateParams **/
        mockStateParams = sinon.stub({
            accountId: 5000000001,
            agencyCodes: '103',
            policyNumber: "1011278"
        });
        module(function($provide) {
            $provide.value('$stateParams', mockStateParams);
        });

        /** mock AgentData service **/
        mockAgentDataService = sinon.stub({
            getCCPaymentFormInfo: {
                get: function(accountId) {
                    return {
                        $promise: {
                            then: function(callback) {
                                callback(mockData);
                                return this;
                            },
                            catch: function(callback) {
                                return this;
                            }
                        }
                    };
                }
            },
        });
        module(function($provide) {
            $provide.value('agentData', mockAgentDataService);
        });
        mockAgentData_getCCPaymentFormInfo_Spy = sinon.spy(mockAgentDataService.getCCPaymentFormInfo, "get");
    });


    /** Instantiate the service **/
    beforeEach(function() {
        inject(function(_creditCardService_) {
            creditCardService = _creditCardService_;
        });
    });


    mockVM = {
        accountId: 5000000001,
        message: {
            type: 'something',
            msg: 'something'
        },
        paymentdue: {
            "amountDue": 2.00
        }
        //"paymentFormData": mockData.data
    };

    /*******************************************************************************/
    /********************************* TESTS ***************************************/
    /*******************************************************************************/
    describe('Credit Card Service suite of tests:', function() {

        it('creditCardService should exist', function() {
            expect(creditCardService).to.exist;
        });

        it('run getCCPaymentFormInfoPromise once', function() {
            creditCardService.getCCPaymentFormInfoPromise(mockVM.accountId);
            expect(mockAgentData_getCCPaymentFormInfo_Spy).to.have.been.callCount(1);
        });


        it('run getIFrameURL and it fails', function() {
            mockData = sinon.stub({
                succeeded: false,
                data: null,
                message: "Error message"
            });

            creditCardService.getIFrameURL(mockVM);
            expect(mockAgentData_getCCPaymentFormInfo_Spy).to.have.been.callCount(1);
            expect(mockVM.message.msg).to.equal('Error message');
            expect(mockVM.contentLoaded).to.be.true;
        });

        it('run getIFrameURL and it succeeds', function() {
            mockData = sinon.stub({
                "succeeded": true,
                "data": {
                    "mode": "TEST",
                    "emailAddress": "broker-127-global@mailinator.com",
                    "transaction_type": "SALE",
                    "responseVersion": "3",
                    "shpf_form_id": "CPRPT",
                    "shpf_account_id": "100231683646",
                    "shpf_tps_def": "TAMPER_PROOF_SEAL MODE SHPF_FORM_ID SHPF_ACCOUNT_ID SHPF_TPS_DEF",
                    "approved_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/approved",
                    "declined_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/declined",
                    "missing_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/error",
                    "accountNumber": "5000010268",
                    "fName": "Ernesto-Inlinght",
                    "lName": "Last",
                    "tps_key": "db63a2af2d6d80542429805fa6916af6",
                    "shpf_key": "02382c60b6cef4704391f1e5e0a7c94d",
                    "merchant": "100231683646",
                    "dba": "CopperPoint",
                    "custom_id1": "LOCAL",
                    "tps_def": "MERCHANT TRANSACTION_TYPE MODE ORDER_ID"
                },
                "message": "Success"
            });
            creditCardService.getIFrameURL(mockVM);
            expect(mockAgentData_getCCPaymentFormInfo_Spy).to.have.been.callCount(1);
            expect(mockData.message).to.equal('Success');
            expect(mockVM.contentLoaded).to.be.true;
        });



        it('run buildBluePayURL', function() {
            mockData = sinon.stub({
                "succeeded": true,
                "data": {
                    "mode": "TEST",
                    "emailAddress": "broker-127-global@mailinator.com",
                    "transaction_type": "SALE",
                    "responseVersion": "3",
                    "shpf_form_id": "CPRPT",
                    "shpf_account_id": "100231683646",
                    "shpf_tps_def": "TAMPER_PROOF_SEAL MODE SHPF_FORM_ID SHPF_ACCOUNT_ID SHPF_TPS_DEF",
                    "approved_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/approved",
                    "declined_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/declined",
                    "missing_url": "http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/error",
                    "accountNumber": "5000010268",
                    "fName": "Ernesto-Inlinght",
                    "lName": "Last",
                    "tps_key": "db63a2af2d6d80542429805fa6916af6",
                    "shpf_key": "02382c60b6cef4704391f1e5e0a7c94d",
                    "merchant": "100231683646",
                    "dba": "CopperPoint",
                    "custom_id1": "LOCAL",
                    "tps_def": "MERCHANT TRANSACTION_TYPE MODE ORDER_ID"
                },
                "message": "Success"
            });
            creditCardService.buildBluePayURL(mockVM);
            expect(mockAgentData_getCCPaymentFormInfo_Spy).to.have.been.callCount(0);
            var testURL = "https://secure.bluepay.com/interfaces/shpf?MERCHANT=100231683646&DBA=CopperPoint&TRANSACTION_TYPE=SALE&MODE=TEST&TAMPER_PROOF_SEAL=db63a2af2d6d80542429805fa6916af6&TPS_DEF=MERCHANT%20TRANSACTION_TYPE%20MODE%20ORDER_ID&RESPONSEVERSION=3&SHPF_FORM_ID=CPRPT&SHPF_ACCOUNT_ID=100231683646&SHPF_TPS=02382c60b6cef4704391f1e5e0a7c94d&SHPF_TPS_DEF=TAMPER_PROOF_SEAL%20MODE%20SHPF_FORM_ID%20SHPF_ACCOUNT_ID%20SHPF_TPS_DEF&AMOUNT=2.00&EMAIL=broker-127-global@mailinator.com&NAME1=Ernesto-Inlinght&NAME2=Last&CUSTOM_ID=LOCAL&ORDER_ID=5000010268&APPROVED_URL=http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/approved&DECLINED_URL=http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/declined&MISSING_URL=http://lp0436.copperpoint.com:9080/delegate/services/payments/creditcard/error";
            expect(mockVM.bluePayURL).to.equal(testURL);
        });

    });
});

/*jshint -W030 */
describe('Customer Account Service Controller', function() {
	var loadDataAction_Spy;
	var controller;
	
	beforeEach(module('agentApp.customerAccountServiceModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";
	});

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller("CustomerAccountServiceCtrlAs", {
			});
		});

		inject(function($injector) {
			loadDataAction_Spy = sinon.spy(controller, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('CustomerAccountServiceCtrlAs', function() {

		it('check CustomerAccountServiceCtrlAs exists', function() {
			instantiateController();
			expect(controller).to.exist;
		});
		
		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(controller.isAgentUser).to.equal(true);
			expect(controller.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction once", function() {
			instantiateController();
			controller.loadDataAction();
			expect(loadDataAction_Spy).to.have.been.callCount(1);
		});
	});

});

/*jshint -W030 */
describe('Customer Policy Service Controller', function() {
    var mockRouteParams, mockData, mockAccountFilterData, mockAgentCustomers, mockLocations, mockFlashMessage;
    var locationsSpy, controller, controllerSpy, agentCustomers_getAgentCustomersList_Spy;

    beforeEach(module('agentApp.customerPolicyServiceModule'));

    beforeEach(function() {
        // add _userperms global
        window._userperms = {};
        _userperms.USERTYPE = "broker";
        _userperms.USERCLASS = "AGENTUSER";
        _userperms.VIEW_AGENCY_USER_MGMT = "true";

        // mock $stateParams
        mockRouteParams = sinon.stub({
            accountId: 1000000001,
            agencyCodes: '103'
        });
        module(function($provide) {
            $provide.value('$stateParams', mockRouteParams);
        });

        /** mock AgentCustomers service **/
        mockAgentCustomers = {
            getDataArray: function(message) {
                return mockData;
            },
            getAgentCustomersList: function(vm) {
                vm.agentCustomerArray = mockData.data;
                vm.contentLoaded = true;
                return mockData;
            },
            getAccountFilterObj: function() {
                return mockAccountFilterData;
            },
            setAccountFilterObj: function(value) {
                mockAccountFilterData = value;
            },
        };
        module(function($provide) {
            $provide.value('agentCustomers', mockAgentCustomers);
        });
        agentCustomers_getAgentCustomersList_Spy = sinon.spy(mockAgentCustomers, "getAgentCustomersList");


        /** mock locations service **/
        mockLocations = {
            getLocationsThenCallback: function() {
                return true;
            }
        };
        module(function($provide) {
            $provide.value('locations', mockLocations);
        });
        locationsSpy = sinon.spy(mockLocations, "getLocationsThenCallback");

        /** mock FlashMessage service **/
        mockFlashMessage = sinon.stub({
            flashMessage: {
                set: function(message) {
                    return null;
                },
                get: function(message) {
                    return 'Mock flushMessage';
                },
                pop: function(message) {
                    return "{type: 'mockType' bdy: 'test message' }";
                }
            }
        });

    });

    /**
     * Method will create the Controller and controller spy
     */
    function instantiateController() {
        /** Define controller **/
        inject(function($controller, $rootScope) {
            newScope = $rootScope.$new();
            controller = $controller("CustomerPolicyServiceCtrlAs", {
                $scope: newScope,
                $stateParams: mockRouteParams,
                locations: mockLocations,
                agentCustomers: mockAgentCustomers,
                _: window._,
                flashMessage: mockFlashMessage
            });
        });

        inject(function($injector) {
            controllerSpy = sinon.spy(controller, "loadDataAction");
        });
    }

    /*******************************************************************************/
    /********************************* TESTS ***************************************/
    /*******************************************************************************/
    describe('CustomerPolicyServiceCtrlAs', function() {

        it('should have the CustomerPolicyService controller', function() {
            instantiateController();
            expect(controller).to.exist;
        });

        it("check that the userPerms object is set to agent", function() {
            instantiateController();
            expect(controller.isAgentUser).to.equal(true);
            expect(controller.isCSRorOMNI).to.equal(false);
        });

        it("controller should run locationsCallbackAction which will call agentCustomers.getAgentCustomersList(vm)", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };
            instantiateController();
            controller.locationsCallbackAction();
            expect(agentCustomers_getAgentCustomersList_Spy).to.have.been.callCount(1);
            expect(controller.agentCustomerArray.length).to.equal(3);
            expect(controller.contentLoaded).to.equal(true);
        });

        it("controller should run locationCallbackAction and message should be undefined", function() {
            instantiateController();
            controller.locationsCallbackAction();
            expect(controller.message).to.be.undefined;
            expect(agentCustomers_getAgentCustomersList_Spy).to.have.been.callCount(1);
            expect(controller.contentLoaded).to.equal(true);
        });

        it("controller should run loadDataAction and call locations angular service", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policySource": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policySource": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policySource": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };
            mockRouteParams = sinon.stub({
                mock: "NO AGENCY CODE"
            }); //set routeParams to empty
            instantiateController();
            controller.loadDataAction();
            expect(controllerSpy).to.have.been.callCount(1);
            expect(locationsSpy).to.have.been.callCount(1);
            expect(agentCustomers_getAgentCustomersList_Spy).to.have.been.callCount(0);
        });

        it("controller should run locationsCallbackAction and then check when we pass a valid accountFilterObj", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };

            mockAccountFilterData = {
                "accounts": ["5000101", "5000102"],
            };

            instantiateController();
            controller.locationsCallbackAction();
            expect(agentCustomers_getAgentCustomersList_Spy).to.have.been.callCount(1);
            expect(controller.agentCustomerArray.length).to.equal(3);
            expect(controller.searchORData.accountFilter).to.include("5000101");
            expect(controller.searchORData.accountFilter).to.include("5000102");
        });


        it("controller should run locationsCallbackAction and then check when we pass in a inValid accountFilterObj", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };

            mockAccountFilterData = {
                "accounts": null
            };

            instantiateController();
            controller.locationsCallbackAction();
            expect(agentCustomers_getAgentCustomersList_Spy).to.have.been.callCount(1);
            expect(controller.agentCustomerArray.length).to.equal(3);
            expect(controller.searchORData.accountFilter).to.equal(null);
        });

        it("controller should run locationsCallbackAction and then check status of toggleAdvancedFilters when equal to false", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };
            mockAccountFilterData = null;

            instantiateController();
            controller.locationsCallbackAction();
            controller.toggleAdvancedFilters();
            controller.toggleAdvancedFilters();
            expect(controller.showAdvancedFilters).to.equal(false);

            expect(controller.searchRangeData.daysTilExpiration.min).to.equal(null);
            expect(controller.searchRangeData.daysTilExpiration.max).to.equal(null);
            expect(controller.searchORData.statusFilter).to.equal(null);
        });

        it("controller should run locationsCallbackAction and then check status of toggleAdvancedFilters when equal to true", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };
            mockAccountFilterData = null;

            instantiateController();
            controller.locationsCallbackAction();
            controller.toggleAdvancedFilters();
            expect(controller.showAdvancedFilters).to.equal(true);

            expect(controller.searchRangeData.daysTilExpiration.min).to.equal(0);
            expect(controller.searchRangeData.daysTilExpiration.max).to.equal(120);
            expect(controller.searchORData.statusFilter.length).to.equal(0);
        });

        it("controller should run locationsCallbackAction and then attempt to run clearAccountFilterMessagePanel", function() {
            mockData = {
                "succeeded": true,
                "data": [{
                    "customerID": "5000011312",
                    "customerName": "Fate Brewing",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011278",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:9801"]
                    }]
                }, {
                    "customerID": "5000011326",
                    "customerName": "3.0 Release Test",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011290",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10206"]
                    }]
                }, {
                    "customerID": "5000011335",
                    "customerName": "Account 101",
                    "policyInfo": [{
                        "policyType": "GW",
                        "policyNumber": "1011300",
                        "agencyCode": "103",
                        "agencyName": "AON Risk Insurance Services West, Inc",
                        "policyTermId": ["pc:10803"]
                    }]
                }],
                "message": ""
            };
            mockAccountFilterData = {
                "accounts": null,
            };

            instantiateController();
            controller.locationsCallbackAction();

            expect(controller.searchORData.accountFilter).to.equal(null);
            controller.clearAccountFilterMessagePanel();
            expect(mockAccountFilterData).to.equal(null);
            expect(controller.searchORData.accountFilter).to.equal(null);
        });

    });

});
/*jshint -W030 */
describe('Customer Documents Landing Controller', function() {
	var mockRouteParams,mockAgentCustomerDocumentAccounts,mockLocations,locationsSpy,mockFlashMessage,controller,agentCustomerDocumentAccountsSpy;

	beforeEach(module('agentApp.customerDocumentsModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '103'});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		/** mock locations service **/
		mockLocations = {getLocationsThenCallback: function() {return true;}};
		module(function($provide){
			$provide.value('locations', mockLocations);
		});
		locationsSpy = sinon.spy(mockLocations, "getLocationsThenCallback");

		/** mock agentCustomerDocumentAccounts service **/
		mockAgentCustomerDocumentAccounts = {landing: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerDocumentAccounts', mockAgentCustomerDocumentAccounts);
		});
		agentCustomerDocumentAccountsSpy = sinon.spy(mockAgentCustomerDocumentAccounts, "landing");

		/** mock FlashMessage service **/
		mockFlashMessage = sinon.stub({
			flashMessage: {
				set: function(message) {
					return null;
				},
				get: function(message) {
					return 'Mock flushMessage';
				},
				pop: function(message) {
					return "{type: 'mockType' bdy: 'test message' }";
				}
			}
		});
		module(function($provide){
			$provide.value('flashMessage', mockFlashMessage);
		});

		module(function($provide){
			$provide.value('_', window._);
		});

		inject(function($injector){
			controller = $injector.get('$controller')('CustomerDocumentsLandingCtrlAs');
		});

	});

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('CustomerDocumentsLandingCtrlAs', function() {

		it('should have the controller', function() {
			expect(controller).to.exist;
		});

		it("check that the userPerms object is set to agent", function() {
			expect(controller.isAgentUser).to.equal(true);
			expect(controller.isCSRorOMNI).to.equal(false);
		});

		it("should call angular locations service from loadDataAction", function() {
			controller.loadDataAction();
			expect(locationsSpy).to.have.been.callCount(1);
		});

		it("should call angular agentCustomerDocumentAccounts service from locationsCallbackAction", function() {
			controller.locationsCallbackAction();
			expect(agentCustomerDocumentAccountsSpy).to.have.been.callCount(1);
		});

	});

});

/*jshint -W030 */
describe('Customer Documents Summary Controller', function() {
	var mockRouteParams,
		mockVM,
		mockAgentPolicies,
		agentPoliciesSpy,
		mockAccountMetadata,
		accountMetadataSpy,
		mockPolicyMetadata,
		policyMetadataSpy,
		mockFlashMessage,
		controller,
		q;

	beforeEach(module('agentApp.customerDocumentsModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '103'});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		mockVM ={};

		/** mock agentCustomerDocumentPolicies service **/
		mockAgentPolicies = {getPoliciesAndPeriods: function() {
			var deferred = q.defer();
			deferred.resolve(true);
			return deferred.promise;
		}};
		module(function($provide){
			$provide.value('agentCustomerDocumentPolicies', mockAgentPolicies);
		});
		agentPoliciesSpy = sinon.spy(mockAgentPolicies, "getPoliciesAndPeriods");

		/** mock agentAccountDocumentMetadata service **/
		mockAccountMetadata = {getMetadata: function() {return true;}};
		module(function($provide){
			$provide.value('agentAccountDocumentMetadata', mockAccountMetadata);
		});
		accountMetadataSpy = sinon.spy(mockAccountMetadata, "getMetadata");

		/** mock agentPolicyTermDocumentMetadata service **/
		mockPolicyMetadata = {getMetadata: function() {return true;}};
		module(function($provide){
			$provide.value('agentPolicyTermDocumentMetadata', mockPolicyMetadata);
		});
		policyMetadataSpy = sinon.spy(mockPolicyMetadata, "getMetadata");

		/** mock FlashMessage service **/
		mockFlashMessage = sinon.stub({
			flashMessage: {
				set: function(message) {
					return null;
				},
				get: function(message) {
					return 'Mock flushMessage';
				},
				pop: function(message) {
					return "{type: 'mockType' bdy: 'test message' }";
				}
			}
		});
		module(function($provide){
			$provide.value('flashMessage', mockFlashMessage);
		});

		inject(function($injector, $q){
			q = $q;
			controller = $injector.get('$controller')('CustomerDocumentsSummaryCtrlAs');
		});

	});

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('CustomerDocumentsSummaryCtrlAs', function() {

		it('should have the controller and call two angluar services on load', function() {
			expect(controller).to.exist;
			expect(accountMetadataSpy).to.have.been.callCount(1);
			expect(agentPoliciesSpy).to.have.been.callCount(1);
		});

		it('getPolicyTermData should call one angluar service', function() {
			controller.getPolicyTermData(mockVM);
			expect(policyMetadataSpy).to.have.been.callCount(1);
		});

		it('updatePolicyAndPeriod should call one angluar service and set values for selectedPeriod and term', function() {
			controller.selectedPolicy = {};
			controller.selectedPolicy.policyNumber = 10001;
			controller.selectedPolicy.policyPeriods = [{term: 'abc123'}];
			controller.updatePolicyAndPeriod();
			expect(policyMetadataSpy).to.have.been.callCount(1);
			expect(controller.selectedPeriod).to.be.an('object');
			expect(controller.term).to.equal('abc123');
		});

	});
	describe('Filter: asDate', function() {
		var asDateFilter;
		beforeEach(inject(function(_asDateFilter_) {
			asDateFilter = _asDateFilter_;
		}));
		it('should format a string to a native Date type', function() {
			expect(asDateFilter('2015-08-05 14:29:07')).to.be.an('date');
		});
	});

});

/*jshint -W030 */
describe('Billing Credit History Service', function() {
	var servicePromise,
		mockHistoryData,
		mockData,
		getChargesHistorySpy,
		getPaymentsHistorySpy,
		mockVM;

	beforeEach(module('agentApp.historyModule'));

	beforeEach(function() {
		// shared service promise function
		servicePromise = function(){
			return {
				$promise: {
					then: function(cb){
						cb(mockData);
						return this;
					},
					catch: function(cb) {
						cb(mockData);
						return this;
					}
				}
			};
		};
		// mock historyData
		mockHistoryData = {
			chargesHistory: {
				get: servicePromise
			},
			paymentsHistory: {
				get: servicePromise
			}
		};
		// provide mockHistoryData to the module as historyData
		module(function($provide){
			$provide.value('historyData', mockHistoryData);
		});
		// spy on get() and delete()
		getChargesHistorySpy = sinon.spy(mockHistoryData.chargesHistory, "get");
		getPaymentsHistorySpy = sinon.spy(mockHistoryData.paymentsHistory, "get");

		// mock vm object for service call
		mockVM = {};
	});

	// get the history service and set it to the local var
	beforeEach(inject(function(_historyService_, $q) {
		historyService = _historyService_;
		$q = $q;
	}));

	describe('Billing/Credit History Service', function() {

		it('should exist', function(){
			expect(historyService).to.exist;
		});

		it("should run getChargesHistory() and call chargesHistory.get() from historyData and return a value", function() {
			mockData = {
		      "succeeded": true,
		      "data": [{sample1: true},{sample2: true}],
		      "message": "",
		      "cached": false
		    };
			historyService.getChargesHistory(mockVM);
			expect(getChargesHistorySpy).to.have.been.callCount(1);
			expect(mockVM.billingData).to.be.an('array');
			expect(mockVM.billingData[0].sample1).to.be.true;
		});

		it("should run getChargesHistory() and call chargesHistory.get() from historyData and NOT return a value when succeeded is false", function() {
			mockData = {
		      "succeeded": false,
		      "data": [],
		      "message": "",
		      "cached": false
		    };
			historyService.getChargesHistory(mockVM);
			expect(getChargesHistorySpy).to.have.been.callCount(1);
			expect(mockVM.billingData).to.be.undefined;
		});

		it("should run getPaymentsHistory() and call paymentsHistory.get() from historyData and return a value", function() {
			mockData = {
		      "succeeded": true,
		      "data": [{sample1: true},{sample2: true}],
		      "message": "",
		      "cached": false
		    };
			historyService.getPaymentsHistory(mockVM);
			expect(getPaymentsHistorySpy).to.have.been.callCount(1);
			expect(mockVM.creditData).to.be.an('array');
			expect(mockVM.creditData[0].sample1).to.be.true;
		});

		it("should run getPaymentsHistory() and call paymentsHistory.get() from historyData and NOT return a value when succeeded is false", function() {
			mockData = {
		      "succeeded": false,
		      "data": [],
		      "message": "",
		      "cached": false
		    };
			historyService.getPaymentsHistory(mockVM);
			expect(getPaymentsHistorySpy).to.have.been.callCount(1);
			expect(mockVM.creditData).to.be.undefined;
		});

	});

});

/*jshint -W030 */
describe('Landing Controller', function() {
	var mockLocations,
		mockLocation,
		mockAgentCustomers,
		mockAccountAlerts,
		controller,
		locationsSpy,
		locationSpy,
		getAgentCustomersListSpy,
		setAccountFilterSpy,
		accountAlertsSpy,
		controllerSpy;

	beforeEach(module('agentApp.landingModule'));

	beforeEach(function(){
		$('<div id="account-alerts"></div>').appendTo('body');
		$('<div id="show-all"></div>').appendTo('body');
		$('<div id="mock-guid"></div>').appendTo('body');
	});

	afterEach(function(){
		$('#account-alerts').remove();
		$('#show-all').remove();
		$('#mock-guid').remove();
	});

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE="employee";
		_userperms.USERCLASS="OMNIADMIN";
		_userperms.VIEW_AGENCY_USER_MGMT="true";

		// locations mock and spy
		mockLocations = {getLocationsThenCallback: function() {return true;}};
		module(function($provide){
			$provide.value('locations', mockLocations);
		});
		locationsSpy = sinon.spy(mockLocations, "getLocationsThenCallback");

		// $location mock and spy
		mockLocation = {path: function() {return true;}};
		module(function($provide){
			$provide.value('$location', mockLocation);
		});
		locationSpy = sinon.spy(mockLocation, "path");

		// agentCustomers mock and spies
		mockAgentCustomers = {
			getAgentCustomersList: function() {return true;},
			setAccountFilter: function() {return true;}
		};
		module(function($provide){
			$provide.value('agentCustomers', mockAgentCustomers);
		});
		getAgentCustomersListSpy = sinon.spy(mockAgentCustomers, "getAgentCustomersList");
		setAccountFilterSpy = sinon.spy(mockAgentCustomers, "setAccountFilter");

		// accountAlerts mock and spy
		mockAccountAlerts = {hideAlert: function() {return true;}};
		module(function($provide){
			$provide.value('accountAlerts', mockAccountAlerts);
		});
		accountAlertsSpy = sinon.spy(mockAccountAlerts, "hideAlert");

		inject(function($injector){
			controller = $injector.get('$controller')('LandingCtrlAs');
			controllerSpy = sinon.spy(controller, "getAgencyInfoAction");
		});
	});

	describe('LandingCtrlAs', function() {
		it('should exist', function(){
			expect(controller).to.exist;
		});
	});

	describe('getAgencyInfoAction()', function() {
		it("should call locations angular service", function() {
			controller.getAgencyInfoAction();
			expect(controllerSpy).to.have.been.callCount(1);
			expect(locationsSpy).to.have.been.callCount(1);
		});
	});

	describe('locationsCallbackAction()', function() {
		it("should call getAgentCustomersList()", function() {
			controller.locationsCallbackAction();
			expect(getAgentCustomersListSpy).to.have.been.callCount(1);
		});
	});

	describe('getAlertClass()', function() {
		it("with 'new', should return 'account-alert alert'", function() {
			var result = controller.getAlertClass('new');
			expect(result).to.equal("account-alert alert");
		});
		it("with 'renewal', should return 'account-alert alert alert-info'", function() {
			var result = controller.getAlertClass('renewal');
			expect(result).to.equal("account-alert alert alert-info");
		});
		it("with 'cancellation', should return 'account-alert alert alert-error'", function() {
			var result = controller.getAlertClass('cancellation');
			expect(result).to.equal("account-alert alert alert-error");
		});
		it("should return 'account-alert alert' as default", function() {
			var result = controller.getAlertClass();
			expect(result).to.equal("account-alert alert");
		});
	});

	describe('getAlertText()', function() {
		it("with 'new', should return 'new customers'", function() {
			var result = controller.getAlertText('new');
			expect(result).to.equal("new customers");
		});
		it("with 'renewal', should return 'customers pending renewal'", function() {
			var result = controller.getAlertText('renewal');
			expect(result).to.equal("customers pending renewal");
		});
		it("with 'cancellation', should return 'customers pending cancellation'", function() {
			var result = controller.getAlertText('cancellation');
			expect(result).to.equal("customers pending cancellation");
		});
		it("should return 'customers' as default", function() {
			var result = controller.getAlertText();
			expect(result).to.equal("customers");
		});
	});

	describe('showAllAlerts()', function() {
		it("should set maxHeight and display to none", function() {
			controller.showAllAlerts();
			var h = document.getElementById('account-alerts').style.maxHeight;
			var d = document.getElementById('show-all').style.display;
			expect(h).to.equal("none");
			expect(d).to.equal("none");
		});
	});

	describe('dismissAlert()', function() {
		it("should call hideAlert() and set display to none", function() {
			controller.dismissAlert(0, 'mock-guid');
			expect(accountAlertsSpy).to.have.been.callCount(1);
			var g = document.getElementById('mock-guid').style.display;
			expect(g).to.equal("none");
		});
	});

	describe('navToPolicyService()', function() {
		it("should call setAccountFilter() and path()", function() {
			controller.agencyCodes = '100-10-1001';
			controller.navToPolicyService(["5000101","5000102"]);
			expect(setAccountFilterSpy).to.have.been.callCount(1);
			expect(locationSpy).to.have.been.callCount(1);
		});
	});

});

/*jshint -W030 */
describe('Locations Service', function() {
	var mockRouteParams, mockLocation, locationSpy, mockData, mockAgentData, serviceSpy, mockVM, vmSpy, locations, getLocationsPromise_Spy;

	beforeEach(module('agentApp.services'));

	beforeEach(function() {
		mockRouteParams = sinon.stub({agencyCodes: '101'});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		mockLocation = {path: function(){return true;}};
		module(function($provide){
			$provide.value('$location', mockLocation);
		});
		locationSpy = sinon.spy(mockLocation, "path");

		mockAgentData = sinon.stub({
			getLocations: {
					get: function(){
					return {
						$promise: {
							then: function(cb){
								cb(mockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			}
		});
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		serviceSpy = sinon.spy(mockAgentData.getLocations, "get");
		mockVM ={locationsCallbackAction: function(){return true;}};
		vmSpy = sinon.spy(mockVM, "locationsCallbackAction");

		module(function($provide){
			$provide.value('_', window._);
		});
	});

	describe('Locations Service', function() {

		describe("getLocationsPromise()", function() {

			beforeEach(inject(function(_locations_) {
				locations = _locations_;

				getLocationsPromise_Spy = sinon.spy(locations, "getLocationsPromise");
			}));


			it("getLocationsPromise() should call fulfillment function", function() {
				locations.getLocationsPromise();
				expect(getLocationsPromise_Spy).to.have.been.callCount(1);
			});

		});

		describe("landing()", function() {
			beforeEach(inject(function(_locations_) {
				locations = _locations_;
			}));


			it("landing() should call agentData service", function() {
				mockData = sinon.stub({
					succeeded: true,
					data: [],
					message: "Success"
				});
				locations.landing(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(mockVM.contentLoaded).to.be.true;
			});

			it("landing() should set message if succeeded is false", function() {
				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				locations.landing(mockVM);
				expect(mockVM.message).to.equal('Error message');
				expect(mockVM.contentLoaded).to.be.true;

			});

		});

		describe("getLocationsThenCallback() with agencyCodes", function() {

			beforeEach(function(){
				mockRouteParams = sinon.stub({agencyCodes: '101'});
				module(function($provide){
					$provide.value('$stateParams', mockRouteParams);
				});
			});

			it("getLocationsThenCallback() should run callback and does call agentData service if agencyCodes is present", function() {

				mockData = sinon.stub({
					succeeded: true,
					data: [],
					message: "Success"
				});
				locations.getLocationsThenCallback(mockVM);
				expect(serviceSpy).to.have.been.callCount(0);
				expect(vmSpy).to.have.been.callCount(1);
			});

		});

		//data.succeeded && data.data.length > 0
		describe("getLocationsThenCallback() with out agencyCodes and data.length > 0", function() {

			beforeEach(function(){
				mockRouteParams = sinon.stub({});
				module(function($provide){
					$provide.value('$stateParams', mockRouteParams);
				});
			});

			beforeEach(inject(function(_locations_) {
				locations = _locations_;
			}));

			it("getLocationsThenCallback() should call agentData service, call $location and run callback", function() {

				mockData = sinon.stub({
					succeeded: true,
					data: [101,102,103],
					message: "Success"
				});
				locations.getLocationsThenCallback(mockVM);
				expect(serviceSpy).to.have.been.callCount(1);
				expect(locationSpy).to.have.been.callCount(1);
				expect(vmSpy).to.have.been.callCount(1);
			});

		});

		//data.succeeded && data.data.length === 0
		describe("getLocationsThenCallback() with out agencyCodes and data.length === 0", function() {

			beforeEach(function(){
				mockRouteParams = sinon.stub({});
				module(function($provide){
					$provide.value('$stateParams', mockRouteParams);
				});
			});

			beforeEach(inject(function(_locations_) {
				locations = _locations_;
			}));

			it("getLocationsThenCallback() should run callback and does call agentData service if agencyCodes is present", function() {

				mockData = sinon.stub({
					succeeded: true,
					data: [],
					message: "Success"
				});
				locations.getLocationsThenCallback(mockVM);
				expect(mockVM.message.msg).to.equal('There was a problem finding your location information. Please contact us at 1.800.231.1363 so that we can assist.');
				expect(serviceSpy).to.have.been.callCount(1);
				expect(vmSpy).to.have.been.callCount(0);
			});

		});

		describe("getLocationsThenCallback() with out agencyCodes and succeeded = false", function() {

			beforeEach(function(){
				mockRouteParams = sinon.stub({});
				module(function($provide){
					$provide.value('$stateParams', mockRouteParams);
				});
			});

			beforeEach(inject(function(_locations_) {
				locations = _locations_;
			}));

			it("getLocationsThenCallback() should call service, set message and not call callback if succeeded is false", function() {

				mockData = sinon.stub({
					succeeded: false,
					data: null,
					message: "Error message"
				});
				locations.getLocationsThenCallback(mockVM);
				expect(mockVM.message.msg).to.equal('Error message');
				expect(serviceSpy).to.have.been.callCount(1);
				expect(vmSpy).to.have.been.callCount(0);
			});

		});

		describe("convertAgencyLocationsToString() Actions", function() {

			it("should convert array to list if array is present", function() {
				var result = locations.convertAgencyLocationsToString([{locationCode: 101}, {locationCode: 102}, {locationCode: 103}]);
				expect(result).to.equal('101,102,103');
			});

			it("should return empty if array is not present", function() {
				var result = locations.convertAgencyLocationsToString();
				expect(result).to.equal('');
			});

		});

	});

});

/*jshint -W030 */
describe('Make ACH Payment Controller', function() {
	var customerPoliciesMockData, agentCustomersMockData, paymentdueMockData;
	var mockRouteParams, mockAgentDataService, mockFlashService, mockPermsService, mockPaymentACHService, mockModal, controller, newScope;
	var mockAgentData_getAgentCustomers_Spy, mockAgentData_getPaymentDue_Spy,
		mockFlash_set_Spy, permsServiceSpy, paymentACHServiceSpy, mockAgentCustomerPolicies, agentCustomerPoliciesSpy, controllerSpy;

	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '103', policyNumber: "1011278"});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		/** mock AgentData service **/
		mockAgentDataService = sinon.stub({
			getAgentCustomers: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(agentCustomersMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			paymentdue: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(paymentdueMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			}
		});

		/** mock agentData service **/
		module(function($provide){
			$provide.value('agentData', mockAgentDataService);
		});
		mockAgentData_getAgentCustomers_Spy = sinon.spy(mockAgentDataService.getAgentCustomers, "get");
		mockAgentData_getPaymentDue_Spy = sinon.spy(mockAgentDataService.paymentdue, "get");


		/** mock FlashMessage service **/
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		mockFlash_set_Spy = sinon.spy(mockFlashService, "set");


		/** mock permsService service **/
		//$scope.role.perm.billPayACH
		mockPermsService = {
			updatePermissions: function(){
				var aPolicy = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
				var aRole = new MODEL.Role(aPolicy);
				return aRole;
			}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {account: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "account");

		/** mock permsService service **/
		mockPaymentACHService = {
			makeACHpayment: function(vm){
				return true;
			}
		};
		module(function($provide){
			$provide.value('paymentACHService', mockPaymentACHService);
		});
		paymentACHServiceSpy = sinon.spy(mockPaymentACHService, "makeACHpayment");


		/** mock $modal service **/
		mockModal = {
			open: function(something){
				return true;
			}
		};
		module(function($provide){
			$provide.value('$modal', mockModal);
		});

	});

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			newScope.form = {};
			newScope.form.terms = false;
			controller = $controller('MakeACHPaymentCtrl', {
				$scope: newScope,
				$stateParams: mockRouteParams,
				agentData: mockAgentDataService,
				_: window._,
				flashMessage: mockFlashService,
				permsService: mockPermsService
			});
		});


		inject(function($injector) {
			controllerSpy = sinon.spy(newScope, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('suite of tests:', function() {

		it('should have the MakeACHPaymentCtrl controller', function() {
			instantiateController();
			expect(controller).to.exist;
		});

		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(newScope.isAgentUser).to.equal(true);
			expect(newScope.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction and call angular service agentCustomerPolicies", function() {
			instantiateController();
			newScope.loadDataAction();
			expect(controllerSpy).to.have.been.callCount(1);
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
		});

		it("controller should run postLoadDataAction and test menu object state", function() {
			var data = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
			paymentdueMockData = {"succeeded":true,"data":{"amountDue":"0","amountPaid":null,"amountBilled":"0","amountUnbilled":null,"paymentStatus":null,"totalPastDue":"0"},"message":""};
			instantiateController();
			newScope.postLoadDataAction(data.data);
			expect(newScope.contentLoaded).to.equal(true);
			expect(newScope.policyNumber).to.equal("1011278");
			expect(newScope.policies).to.be.an('array');
			expect(newScope.customerName).to.equal("Fate Brewing");
			expect(newScope.selectedPolicy).to.be.an('object');
			expect(newScope.menu.accountName).to.equal("Fate Brewing");
			expect(newScope.menu.accountId).to.equal(1000000001);
		});

	});

});

/*jshint -W030 */
describe('Menu Bar Controller', function() {
	var controller, newScope, newLocation, mockRouteParams, mockState, newTimeout, mockScrollToService;
	var defaultPathURL = "";

	beforeEach(module('agentApp.menuBarModule'));

    beforeEach(function() {

		// mock $state
		mockState = {
			go: function(){return true;},
			current: 'test'
		};
		module(function($provide){
			$provide.value('$state', mockState);
		});
		
		// mock scrollTo
		mockScrollToService = {
			//empty
		};
		module(function($provide){
			$provide.value('scrollToService', mockScrollToService);
		});
		
		// mock $stateParams
        mockRouteParams = sinon.stub({
            pastFirstClick: false
        });
        module(function($provide) {
            $provide.value('$stateParams', mockRouteParams);
        });

		inject(function($controller, $rootScope, $location, $timeout) {
			newScope = $rootScope.$new();
			newLocation = $location;
			newTimeout = $timeout;
			$location.path(defaultPathURL);
			controller = $controller("MenuBarCtrl", {
				$scope: newScope,
				$location: newLocation,
				$timeout: newTimeout
			});
		});

    });



	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('MenuBarCtrl', function() {

		it('should select second by default when path is empty', function(){
			newLocation.path('/');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isFirstOpen).to.be.false;
			expect(controller.status.isSecondOpen).to.be.true;
		});

		it('should select first when path contains agency', function(){
			newLocation.path('/agency-dashboard');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isFirstOpen).to.be.true;
			expect(controller.status.isSecondOpen).to.be.false;
		});

		it('should select second when path contains customer', function(){
			newLocation.path('/customer-reports');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isFirstOpen).to.be.false;
			expect(controller.status.isSecondOpen).to.be.true;
		});

		it('should highlight customer-policy-service button', function(){
			newLocation.path('/customer-policy-service/110-008-0002');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isPolicyServiceHighlighted).to.be.true;
			expect(controller.status.isDocumentsHighlighted).to.be.false;
			expect(controller.status.isAccountServiceHighlighted).to.be.false;
		});

		it('should highlight customer-documents button', function(){
			newLocation.path('/customer-documents/');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isPolicyServiceHighlighted).to.be.false;
			expect(controller.status.isDocumentsHighlighted).to.be.true;
			expect(controller.status.isAccountServiceHighlighted).to.be.false;
		});

		it('should highlight customer-account-service button', function(){
			newLocation.path('/customer-account-service/');
			//$apply the change to trigger the $watch.
			newScope.$apply();

			expect(controller.status.isPolicyServiceHighlighted).to.be.false;
			expect(controller.status.isDocumentsHighlighted).to.be.false;
			expect(controller.status.isAccountServiceHighlighted).to.be.true;
		});

	});

});

/*jshint -W030 */
describe('New Certificate Controller', function() {
	var $scope,
	$httpBackend,
	mockLocation,
	mockRouteParams,
	mockPermsService,
	mockFlashService,
	mockAgentData,
	mockCustomerPoliciesData,
	mockAgentCustomerPolicies,
	locationSpy,
	permsServiceSpy,
	flashServiceSpy,
	agentCustomerPoliciesSpy,
	controller;

	beforeEach(module('agentApp.certificatesModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE="employee";
		_userperms.USERCLASS="OMNIADMIN";
		_userperms.VIEW_AGENCY_USER_MGMT="true";

		// mock $location
		mockLocation = {
			path: function(){return true;}
		};
		module(function($provide){
			$provide.value('$location', mockLocation);
		});
		locationSpy = sinon.spy(mockLocation, "path");

		// mock $stateParams
		mockRouteParams = sinon.stub({
			accountId: '1000000001',
			agencyCodes: '101',
			policyNumber: '1000001',
			policyPeriodId: 'pc:10001',
			certificateId: 7757663
		});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		// mock permsService
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		// mock flashMessage
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		flashServiceSpy = sinon.spy(mockFlashService, "set");

		// mock mockCustomerPoliciesData
		mockCustomerPoliciesData = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {certsClaims: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "certsClaims");

		inject(function($injector, $rootScope){
			$httpBackend = $injector.get('$httpBackend');
			$httpBackend.when('POST', '/delegate/services/api/certificates')
				.respond({
					succeeded: true,
					data: {},
					message: "Success"
				});
			$httpBackend.when('GET', '/certificates-portlet/js/states.json')
				.respond([{ "name": "Arizona", "abbreviation": "AZ"}]);
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('CreateCertificateCtrl', {
				$scope: $scope,
				_: window._
			});
		});

//		//Method showAutoCompleteValidMsg removed 3/25/2015. 
//		// sample dom elements for tests
//		$('<div id="sampleTrueElementId"><input type="text" id="sampleTrueElement" name="sampleElement" class="ng-dirty ng-invalid-required"></div>').appendTo('body');
//		$('<div id="sampleFalseElementId"><input type="text" id="sampleFalseElement" name="sampleElement" class=""></div>').appendTo('body');

	});

//	//Method showAutoCompleteValidMsg removed 3/25/2015
//	afterEach(function() {
//		$('#sampleTrueElementId').remove();
//		$('#sampleFalseElementId').remove();
//	});

	describe('CreateCertificateCtrl', function() {

		it('should have the New Certificate controller', function(){
			expect(controller).to.exist;
		});

		it("controller should run loadDataAction, call agentData service then run applyPolicyPerms and applyCertificatePerms", function() {
			/*
			This test runs the following chained functions:
			$scope.loadDataAction()
				applyPolicyPerms()
					setDefaultSelection()
			*/
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$httpBackend.flush();
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
			expect(permsServiceSpy).to.have.been.callCount(1);
		});

		it("hasWaviers returns true when waviers exist", function() {
			$scope.policyPeriod = mockCustomerPoliciesData.data.policies[0].policyPeriods[0];
			expect($scope.hasWaviers()).to.be.true;
		});

		it("hasWaviers returns false when waviers do not exist", function() {
			$scope.policyPeriod = {};
			$scope.policyPeriod.waivers = [];
			expect($scope.hasWaviers()).to.be.false;
		});

		
//		//Method showAutoCompleteValidMsg removed 3/25/2015
//		it("showAutoCompleteValidMsg returns true when ng-dirty ng-invalid-required are applied", function() {
//			expect($scope.showAutoCompleteValidMsg("sampleTrueElement")).to.be.true;
//		});
//		//Method showAutoCompleteValidMsg removed 3/25/2015
//		it("showAutoCompleteValidMsg returns false when ng-dirty ng-invalid-required are not applied", function() {
//			expect($scope.showAutoCompleteValidMsg("sampleFalseElement")).to.be.false;
//		});

		it("subWaiverConsumerDisplayStr returns sample as Sample when subWaiverConsumer exists", function() {
			$scope.certificate = {};
			$scope.certificate.subWaiverConsumer = 'sample';
			expect($scope.subWaiverConsumerDisplayStr()).to.equal('Sample');
		});

		it("subWaiverConsumerDisplayStr returns N/A when subWaiverConsumer does not exist", function() {
			$scope.certificate = {};
			expect($scope.subWaiverConsumerDisplayStr()).to.equal('N/A');
		});

		it("someSelected returns true with an object that has keys", function() {
			var obj = {
				a: 1,
				b: 2,
				c: 3
			};
			expect($scope.someSelected(obj)).to.be.true;
		});

		it("someSelected returns false with an empty object", function() {
			var obj = {};
			expect($scope.someSelected(obj)).to.be.false;
		});

		it("processForm runs then calls flashMessage and $location", function() {
			$scope.loadDataAction();
			$scope.applyPolicyPerms(mockCustomerPoliciesData.data);
			$httpBackend.flush();
			$httpBackend.resetExpectations();
			$scope.selectedPolicy = mockCustomerPoliciesData.data.policies[0];
			$scope.certificate = {
				offDutyOfficer: 'Sample',
				endeavorToCancel: 'Sample',
				subWaiverConsumer: 'Sample',
				renew: 'Sample',
				showInCareOf: 'Sample',
				addressOnBack: 'Sample',
				holder:{
					name: 'Sample',
					careOfName: 'Sample',
					address:{
						addressLine1: 'Sample',
						addressLine2: 'Sample',
						city: 'Sample',
						postalCode: 'Sample',
					}
				}
			};
			$scope.selectedState = {};
			$scope.selectedState.abbreviation = 'AZ';
			$scope.processForm(true);
			$httpBackend.flush();
			expect(flashServiceSpy).to.have.been.callCount(1);
			expect(locationSpy).to.have.been.callCount(1);
		});

	});

});
/*jshint -W030 */
describe('Payment Due Service', function() {
	var servicePromise,
		mockAgentData,
		mockData,
		adminPaymentSpy,
		paymentSpy,
		mockVM;

	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		// shared service promise function
		servicePromise = function(){
			return {
				$promise: {
					then: function(cb){
						cb(mockData);
						return this;
					},
					catch: function(cb) {
						cb(mockData);
						return this;
					}
				}
			};
		};
		// mock agentData
		mockAgentData = {
			adminpaymentdue: {
				get: servicePromise
			},
			paymentdue: {
				get: servicePromise
			}
		};
		// provide mockAgentData to the module as agentData
		module(function($provide){
			$provide.value('agentData', mockAgentData);
		});
		// spy on get() and delete()
		adminPaymentSpy = sinon.spy(mockAgentData.adminpaymentdue, "get");
		paymentSpy = sinon.spy(mockAgentData.paymentdue, "get");

		// mock vm object for service call
		mockVM = {
			selectedPolicy: {
				ownerID: 100001
			},
			accountId: 100001
		};
	});

	// get the history service and set it to the local var
	beforeEach(inject(function(_paymentDueService_) {
		paymentDueService = _paymentDueService_;
	}));

	describe('Payment Due Service', function() {

		it('should exist', function(){
			expect(paymentDueService).to.exist;
		});

		it("should run getPayment() as a standard user and call paymentdue.get() from agentData and return a value", function() {
			mockData = {
		      "succeeded": true,
		      "data": [{sample1: true},{sample2: true}],
		      "message": "",
		      "cached": false
		    };
			mockVM.isCSRorOMNI = false;
			paymentDueService.getPayment(mockVM);
			expect(paymentSpy).to.have.been.callCount(1);
			expect(adminPaymentSpy).to.have.been.callCount(0);
			expect(mockVM.paymentdue).to.be.an('array');
			expect(mockVM.paymentdue[0].sample1).to.be.true;
			expect(mockVM.paymentDueLoaded).to.be.true;
		});

		it("should run getPayment() as a standard user and call paymentdue.get() from agentData and NOT return a value when succeeded is false", function() {
			mockData = {
		      "succeeded": false,
		      "data": [],
		      "message": "",
		      "cached": false
		    };
			mockVM.isCSRorOMNI = false;
			paymentDueService.getPayment(mockVM);
			expect(paymentSpy).to.have.been.callCount(1);
			expect(adminPaymentSpy).to.have.been.callCount(0);
			expect(mockVM.message).to.be.an('object');
			expect(mockVM.message.msg).not.to.be.empty;
			expect(mockVM.paymentDueLoaded).to.be.true;
		});


		it("should run getPayment() as an admin user and call adminpaymentdue.get() from agentData and return a value", function() {
			mockData = {
		      "succeeded": true,
		      "data": [{sample1: true},{sample2: true}],
		      "message": "",
		      "cached": false
		    };
			mockVM.isCSRorOMNI = true;
			paymentDueService.getPayment(mockVM);
			expect(adminPaymentSpy).to.have.been.callCount(1);
			expect(paymentSpy).to.have.been.callCount(0);
			expect(mockVM.paymentdue).to.be.an('array');
			expect(mockVM.paymentdue[0].sample1).to.be.true;
			expect(mockVM.paymentDueLoaded).to.be.true;
		});

		it("should run getPayment() as an admin user and call adminpaymentdue.get() from agentData and NOT return a value when succeeded is false", function() {
			mockData = {
		      "succeeded": false,
		      "data": [],
		      "message": "",
		      "cached": false
		    };
			mockVM.isCSRorOMNI = true;
			paymentDueService.getPayment(mockVM);
			expect(adminPaymentSpy).to.have.been.callCount(1);
			expect(paymentSpy).to.have.been.callCount(0);
			expect(mockVM.message).to.be.an('object');
			expect(mockVM.message.msg).not.to.be.empty;
			expect(mockVM.paymentDueLoaded).to.be.true;
		});

	});

});

/*jshint -W030 */
describe('PaymentACH Service', function() {
    //var locationsMockData, customerPoliciesMockData, agentCustomersMockData, premiumreportMockData;
    var paymentACHService;
    var mockData, mockVM;
    var mockStateParams, mockAgentDataService, mockFlashService;
    var spy_makeACHpaymentAdmin, spy_makeACHpaymentAgent, spy_flash_set, spy_location_path;


    beforeEach(module('agentApp.services'));

    beforeEach(function() {

        /** mock $stateParams **/
        mockStateParams = sinon.stub({
            accountId: 5000000001,
            agencyCodes: '103',
            policyNumber: "1011278"
        });
        module(function($provide) {
            $provide.value('$stateParams', mockStateParams);
        });

        /** mock AgentData service **/
        mockAgentDataService = sinon.stub({
            makeACHpaymentAdmin: {
                save: function(paymentData) {
                    return {
                        $promise: {
                            then: function(callback) {
                                callback(mockData);
                                return this;
                            },
                            catch: function(callback) {
                                return this;
                            }
                        }
                    };
                }
            },
            makeACHpaymentAgent: {
                save: function(paymentData) {
                    return {
                        $promise: {
                            then: function(callback) {
                                callback(mockData);
                                return this;
                            },
                            catch: function(callback) {
                                return this;
                            }
                        }
                    };
                }
            },
        });
        module(function($provide) {
            $provide.value('agentData', mockAgentDataService);
        });
        spy_makeACHpaymentAdmin = sinon.spy(mockAgentDataService.makeACHpaymentAdmin, "save");
        spy_makeACHpaymentAgent = sinon.spy(mockAgentDataService.makeACHpaymentAgent, "save");


        /** mock FlashMessage service **/
        mockFlashService = {
            set: function() {
                return true;
            }
        };
        module(function($provide) {
            $provide.value('flashMessage', mockFlashService);
        });
        spy_flash_set = sinon.spy(mockFlashService, "set");


        /** mock $location service **/
        mockLocation = {
            path: function() {
                return true;
            }
        };
        module(function($provide) {
            $provide.value('$location', mockLocation);
        });
        spy_location_path = sinon.spy(mockLocation, "path");
    });


    /** Instantiate the service **/
    beforeEach(function() {
        inject(function(_paymentACHService_) {
            paymentACHService = _paymentACHService_;
        });
    });


    mockVM = {
        isCSRorOMNI: false,
        accountId: 5000000001,
        message: {
            type: 'something',
            msg: 'something'
        },
        paymentdueData: {
            "amountDue": 2.00,
        },
        amount: "2.00",
        bankAccountNumber: "1234",
        routingNumber: "1234",
        paymentMethod: "WEBACH",
        accountType: "checking",
        selectedPolicy: {
            "ownerID": "5000000001"
        }
    };

    /*******************************************************************************/
    /********************************* TESTS ***************************************/
    /*******************************************************************************/
    describe('Credit Card Service suite of tests:', function() {

        it('paymentACHService should exist', function() {
            expect(paymentACHService).to.exist;
        });

        it('run makeACHpaymentAdmin once', function() {
            mockVM.isCSRorOMNI = true;
            paymentACHService.makeACHpaymentPromise(mockVM);
            expect(spy_makeACHpaymentAdmin).to.have.been.callCount(1);
            expect(spy_makeACHpaymentAgent).to.have.been.callCount(0);
        });

        it('run makeACHpaymentAgent once', function() {
            mockVM.isCSRorOMNI = false;
            paymentACHService.makeACHpaymentPromise(mockVM);
            expect(spy_makeACHpaymentAdmin).to.have.been.callCount(0);
            expect(spy_makeACHpaymentAgent).to.have.been.callCount(1);
        });

        it('run getPaymentDataObj and get back paymentData', function() {
            paymentACHService.getPaymentDataObj(mockVM);
            expect(spy_makeACHpaymentAdmin).to.have.been.callCount(0);
            expect(spy_makeACHpaymentAgent).to.have.been.callCount(0);
            expect(mockVM.paymentData).to.exist;
            expect(mockVM.paymentData.amount).to.equal(2);
        });

        it('run makeACHpayment and it succeeds', function() {
            mockData = sinon.stub({
                "succeeded": true,
                "data": {
                    "amountDue": "2",
                    "amountPaid": null,
                    "amountBilled": "0",
                    "amountUnbilled": null,
                    "paymentStatus": null,
                    "totalPastDue": "0"
                },
                "message": "Success",
                "cached": false
            });
            paymentACHService.makeACHpayment(mockVM);
            expect(spy_makeACHpaymentAdmin).to.have.been.callCount(0);
            expect(spy_makeACHpaymentAgent).to.have.been.callCount(1);
            expect(spy_flash_set).to.have.been.callCount(1);
            expect(spy_location_path).to.have.been.callCount(1);
            expect(mockData.message).to.equal('Success');
            expect(mockVM.contentLoaded).to.notexist;
        });



        it('run makeACHpayment and it succeeds', function() {
            mockData = sinon.stub({
                "succeeded": false,
                "data": {},
                "message": "Error",
                "cached": false
            });
            paymentACHService.makeACHpayment(mockVM);
            expect(spy_makeACHpaymentAdmin).to.have.been.callCount(0);
            expect(spy_makeACHpaymentAgent).to.have.been.callCount(1);
            expect(spy_flash_set).to.have.been.callCount(1);
            expect(spy_location_path).to.have.been.callCount(1);
            expect(mockData.message).to.equal('Error');
            expect(mockVM.contentLoaded).to.notexist;
        });
    });
});

/*jshint -W030 */
describe('Pick Payment Option Controller', function() {
	var spy_loadDataAction, spy_mockFlashMessage_set, spy_permsService_updatePermissions, spy_agentCustomerPolicies_account, spy_postLoadDataAction;
	var mockStateParams, mockflashMessageService, mockPermsService, mockAgentCustomerPolicies;
	var agentCustomerPolicies, controller;

	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		/** mock $stateParams **/
		mockStateParams = sinon.stub({accountId: 1000000001, agencyCodes: '103', policyNumber: "1011278"});
		module(function($provide){
			$provide.value('$stateParams', mockStateParams);
		});
		
		/** mock $state service **/
		mockState = {
			go: function(){return true;},
			current: 'test'
		};
		module(function($provide){
			$provide.value('$state', mockState);
		});

		/** mock FlashMessage service **/
		mockflashMessageService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockflashMessageService);
		});
		spy_mockFlashMessage_set = sinon.spy(mockflashMessageService, "set");


		/** mock permsService service **/
		mockPermsService = {
			updatePermissions: function(){
				var aPolicy = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
				var aRole = new MODEL.Role(aPolicy);
				return aRole;
			}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		spy_permsService_updatePermissions = sinon.spy(mockPermsService, "updatePermissions");

				
		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {account: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		spy_agentCustomerPolicies_account = sinon.spy(mockAgentCustomerPolicies, "account");
		
	});

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller('PickPaymentOptionCtrl', {
				$scope: newScope,
				$state: mockState,
				$stateParams: mockStateParams,
				flashMessage: mockflashMessageService,	
				permsService: mockPermsService
			});
		});

		inject(function($injector) {
			spy_loadDataAction = sinon.spy(controller, "loadDataAction");
			spy_postLoadDataAction = sinon.spy(controller, "postLoadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('suite of tests:', function() {

		it('should have the PickPaymentOptionCtrl controller', function() {
			instantiateController();
			expect(controller).to.exist;
		});

		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(controller.isAgentUser).to.equal(false);
			expect(controller.isCSRorOMNI).to.equal(true);
		});

		it("controller should run loadDataAction and not call postLoadDataAction", function() {
			instantiateController();
			controller.loadDataAction();
			expect(spy_loadDataAction).to.have.been.callCount(1);
			expect(spy_postLoadDataAction).to.have.been.callCount(0);
		});
		
		
		it("controller should run loadDataAction and call postLoadDataAction", function() {
			instantiateController();
			controller.loadDataAction();
			var mockResponse = {"succeeded":true,"data":{"policies":[{"policyNumber":"1000001","policyType":"GW","ownerID":"5000011307","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"employee","userClass":"AGENTMANAGEMENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:10001","status":"In Force","parentPolicyId":"1011277","effectiveDate":"2014-10-22T00:00:00","expirationDate":"2015-10-22T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":null},"namedInsureds":[{"name":"Waiver of Sub Test","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0005","classCodeSuffix":null,"classCodeSuffixName":"FARM - TREE PLANTING - REFORESTATION"}],"waivers":[{"holderName":null,"type":"blanket"},{"holderName":"John's comp","type":"scheduled"}],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011307","accountName":"Waiver of Sub Test","emailAddress":"","address":{"addressLine1":"30 N 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":null,"country":"US"},"fein":null}},"message":""};
			var data = mockResponse.data;
			controller.postLoadDataAction(data);
			expect(spy_loadDataAction).to.have.been.callCount(1);
			expect(spy_postLoadDataAction).to.have.been.callCount(1);
		});

	});

});

/*jshint -W030 */
describe('Report Premium Controller', function() {
	var locationsMockData, customerPoliciesMockData, agentCustomersMockData, premiumreportMockData;
	var mockRouteParams, mockAgentDataService, mockFlashService, mockPermsService, controller, newScope;
	var mockAgentData_getAgentCustomers_Spy, mockAgentData_getLocations_Spy, mockAgentData_getAgenctPolicies_Spy, mockAgentData_getPremiumreport_Spy,
		mockFlash_set_Spy, permsServiceSpy, mockAgentCustomerPolicies, agentCustomerPoliciesSpy, controllerSpy;


	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '103', policyNumber: "1011278"});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		/** mock AgentData service **/
		mockAgentDataService = sinon.stub({
			getBussedData: function() {
				var value = {
					"amount": 12,
					"description": null,
					"paymentDate": null,
					"paymentDestination": "Account",
					"paymentMethod": "WEBACHEFT",
					"accountType": "checking",
					"bankAccountNumber": "123567",
					"routingNumber": "1234567",
					"accountNumber": "5000011312"
				};
				return value;
			},
			getAgentCustomers: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(agentCustomersMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			getLocations: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(locationsMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			getAgentCustomerPolicies: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(customerPoliciesMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			premiumreport: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(premiumreportMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
		});

		/** mock agentData service **/
		module(function($provide){
			$provide.value('agentData', mockAgentDataService);
		});
		mockAgentData_getLocations_Spy = sinon.spy(mockAgentDataService.getLocations, "get");
		mockAgentData_getAgentCustomers_Spy = sinon.spy(mockAgentDataService.getAgentCustomers, "get");
		mockAgentData_getAgenctPolicies_Spy = sinon.spy(mockAgentDataService.getAgentCustomerPolicies, "get");
		mockAgentData_getPremiumreport_Spy = sinon.spy(mockAgentDataService.premiumreport, "get");


		/** mock FlashMessage service **/
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		mockFlash_set_Spy = sinon.spy(mockFlashService, "set");


		/** mock permsService service **/
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {account: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "account");

	});

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller('ReportPremiumCtrl', {
				$scope: newScope,
				$stateParams: mockRouteParams,
				agentData: mockAgentDataService,
				_: window._,
				flashMessage: mockFlashService,
				permsService: mockPermsService
			});
		});

		inject(function($injector) {
			controllerSpy = sinon.spy(newScope, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('suite of tests:', function() {

		it('should have the ReportPremiumCtrl controller', function() {
			instantiateController();
			expect(controller).to.exist;
		});

		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(newScope.isAgentUser).to.equal(true);
			expect(newScope.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction and call angular service agentCustomerPolicies", function() {
			instantiateController();
			newScope.loadDataAction();
			expect(controllerSpy).to.have.been.callCount(1);
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
		});

		it("controller should run postLoadDataAction and test menu object state", function() {
			var data = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
			premiumreportMockData = {"succeeded":true,"data":[{"payrolls":[{"employeeCount":0,"grossPayrollAmount":0,"locationCode":"1","referenceId":13606,"classCode":{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}}],"policy":{"policyNumber":"1011326","policyType":"Workers' Compensation (v7)","ownerID":"5000011354","status":"In Force","powerSuitePolicyNumber":"","userPermissions":null,"policyPeriods":[{"policyPeriodId":"pc:11705","status":"In Force","parentPolicyId":"1011326","effectiveDate":"2015-01-01T00:00:00","expirationDate":"2016-01-01T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"350 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"inflectra","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"},"reportPeriodStartDate":"2015-02-01T00:00:00","reportPeriodEndDate":"2015-03-01T00:00:00","reportPeriodDueDate":"2015-03-26T00:00:00","reportingPeriodFrequency":"Monthly"},{"payrolls":[{"employeeCount":0,"grossPayrollAmount":0,"locationCode":"1","referenceId":13606,"classCode":{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}}],"policy":{"policyNumber":"1011326","policyType":"Workers' Compensation (v7)","ownerID":"5000011354","status":"In Force","powerSuitePolicyNumber":"","userPermissions":null,"policyPeriods":[{"policyPeriodId":"pc:11705","status":"In Force","parentPolicyId":"1011326","effectiveDate":"2015-01-01T00:00:00","expirationDate":"2016-01-01T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"350 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"inflectra","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"},"reportPeriodStartDate":"2015-01-01T00:00:00","reportPeriodEndDate":"2015-02-01T00:00:00","reportPeriodDueDate":"2015-02-26T00:00:00","reportingPeriodFrequency":"Monthly"}],"message":""};
			instantiateController();
			newScope.postLoadDataAction(data.data);
			expect(newScope.policyNumber).to.equal("1011278");
			expect(newScope.policies).to.be.an('array');
			expect(newScope.customerName).to.equal("Fate Brewing");
			expect(newScope.selectedPolicy).to.be.an('object');
			expect(newScope.menu.accountName).to.equal("Fate Brewing");
			expect(newScope.menu.accountId).to.equal(1000000001);
		});

	});

});

/*jshint -W030 */
describe('Submit Report Controller', function() {
	var locationsMockData, customerPoliciesMockData, agentCustomersMockData, premiumreportMockData;
	var mockRouteParams, mockAgentDataService, mockFlashService, mockPermsService, controller, newScope;
	var mockAgentData_getAgentCustomers_Spy, mockAgentData_getLocations_Spy, mockAgentData_getAgenctPolicies_Spy, mockAgentData_getPremiumreport_Spy,
		mockFlash_set_Spy, permsServiceSpy, mockAgentCustomerPolicies, agentCustomerPoliciesSpy, controllerSpy;


	beforeEach(module('agentApp.billingModule'));

	beforeEach(function() {
		// add _userperms global
		window._userperms = {};
		_userperms.USERTYPE = "broker";
		_userperms.USERCLASS = "AGENTUSER";
		_userperms.VIEW_AGENCY_USER_MGMT = "true";

		// mock $stateParams
		mockRouteParams = sinon.stub({accountId: 1000000001, agencyCodes: '103', policyNumber: "1011278"});
		module(function($provide){
			$provide.value('$stateParams', mockRouteParams);
		});

		/** mock AgentData service **/
		mockAgentDataService = sinon.stub({
			getBussedData: function() {
				var value = {
					"amount": 12,
					"description": null,
					"paymentDate": null,
					"paymentDestination": "Account",
					"paymentMethod": "WEBACHEFT",
					"accountType": "checking",
					"bankAccountNumber": "123567",
					"routingNumber": "1234567",
					"accountNumber": "5000011312"
				};
				return value;
			},
			getAgentCustomers: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(agentCustomersMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			getLocations: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(locationsMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			getAgentCustomerPolicies: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(customerPoliciesMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
			premiumreport: {
				get: function() {
					return {
						$promise: {
							then: function(callback) {
								callback(premiumreportMockData);
								return this;
							},
		                	catch: function(callback) {
		                        return this;
							}
						}
					};
				}
			},
		});

		/** mock agentData service **/
		module(function($provide){
			$provide.value('agentData', mockAgentDataService);
		});
		mockAgentData_getLocations_Spy = sinon.spy(mockAgentDataService.getLocations, "get");
		mockAgentData_getAgentCustomers_Spy = sinon.spy(mockAgentDataService.getAgentCustomers, "get");
		mockAgentData_getAgenctPolicies_Spy = sinon.spy(mockAgentDataService.getAgentCustomerPolicies, "get");
		mockAgentData_getPremiumreport_Spy = sinon.spy(mockAgentDataService.premiumreport, "get");


		/** mock FlashMessage service **/
		mockFlashService = {
			set: function(){return true;}
		};
		module(function($provide){
			$provide.value('flashMessage', mockFlashService);
		});
		mockFlash_set_Spy = sinon.spy(mockFlashService, "set");


		/** mock permsService service **/
		mockPermsService = {
			updatePermissions: function(){return null;}
		};
		module(function($provide){
			$provide.value('permsService', mockPermsService);
		});
		permsServiceSpy = sinon.spy(mockPermsService, "updatePermissions");

		/** mock agentCustomerPolicies service **/
		mockAgentCustomerPolicies = {account: function() {return true;}};
		module(function($provide){
			$provide.value('agentCustomerPolicies', mockAgentCustomerPolicies);
		});
		agentCustomerPoliciesSpy = sinon.spy(mockAgentCustomerPolicies, "account");

	});

	/**
	 * Method will create the Controller and controller spy
	 */
	function instantiateController() {
		/** Define controller **/
		inject(function($controller, $rootScope) {
			newScope = $rootScope.$new();
			controller = $controller('SubmitReportCtrl', {
				$scope: newScope,
				$stateParams: mockRouteParams,
				agentData: mockAgentDataService,
				_:window._,
				flashMessage: mockFlashService,
				permsService: mockPermsService
			});
		});

		inject(function($injector) {
			controllerSpy = sinon.spy(newScope, "loadDataAction");
		});
	}

	/*******************************************************************************/
	/********************************* TESTS ***************************************/
	/*******************************************************************************/
	describe('suite of tests:', function() {

		it('should have the SubmitReportCtrl controller', function() {
			instantiateController();
			expect(controller).to.exist;
		});

		it("check that the userPerms object is set to agent", function() {
			instantiateController();
			expect(newScope.isAgentUser).to.equal(true);
			expect(newScope.isCSRorOMNI).to.equal(false);
		});

		it("controller should run loadDataAction and call angular service agentCustomerPolicies", function() {
			instantiateController();
			newScope.loadDataAction();
			expect(controllerSpy).to.have.been.callCount(1);
			expect(agentCustomerPoliciesSpy).to.have.been.callCount(1);
		});

		it("controller should run postLoadDataAction", function() {
			var data = {"succeeded":true,"data":{"policies":[{"policyNumber":"1011278","policyType":"GW","ownerID":"5000011312","status":"In Force","powerSuitePolicyNumber":null,"userPermissions":{"userPermissions":{"CERTS_DELETE":true,"CERTS_VIEW":true,"VIEW_CLAIMS":true,"VIEW_BILLING":true,"SUBMIT_CLAIMS":true,"REPORT_BILLING":true,"CERTS_CREATE":true,"USER_MGMT":true,"CERTS_SAVE":true,"PAY_BILLING_CC":true,"PAY_BILLING_ACH":true,"CANCEL_CLAIMS":true},"userType":"broker","userClass":"AGENTUSER"},"policyPeriods":[{"policyPeriodId":"pc:9801","status":"In Force","parentPolicyId":"1011278","effectiveDate":"2014-10-27T00:00:00","expirationDate":"2015-10-27T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"","country":"Maricopa"},"namedInsureds":[{"name":"Fate Brewing","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"9082","classCodeSuffix":null,"classCodeSuffixName":"RESTAURANT NOC"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"}],"powerSuiteId":"","guidewireAccount":{"accountNumber":"5000011312","accountName":"Fate Brewing","emailAddress":"","address":{"addressLine1":"7564 E. Shea Blvd.","addressLine2":null,"city":"Scottsdale","state":"AZ","postalCode":"85050","county":"Maricopa","country":"US"},"fein":null}},"message":""};
			premiumreportMockData = {"succeeded":true,"data":[{"payrolls":[{"employeeCount":0,"grossPayrollAmount":0,"locationCode":"1","referenceId":13606,"classCode":{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}}],"policy":{"policyNumber":"1011326","policyType":"Workers' Compensation (v7)","ownerID":"5000011354","status":"In Force","powerSuitePolicyNumber":"","userPermissions":null,"policyPeriods":[{"policyPeriodId":"pc:11705","status":"In Force","parentPolicyId":"1011326","effectiveDate":"2015-01-01T00:00:00","expirationDate":"2016-01-01T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"350 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"inflectra","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"},"reportPeriodStartDate":"2015-02-01T00:00:00","reportPeriodEndDate":"2015-03-01T00:00:00","reportPeriodDueDate":"2015-03-26T00:00:00","reportingPeriodFrequency":"Monthly"},{"payrolls":[{"employeeCount":0,"grossPayrollAmount":0,"locationCode":"1","referenceId":13606,"classCode":{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}}],"policy":{"policyNumber":"1011326","policyType":"Workers' Compensation (v7)","ownerID":"5000011354","status":"In Force","powerSuitePolicyNumber":"","userPermissions":null,"policyPeriods":[{"policyPeriodId":"pc:11705","status":"In Force","parentPolicyId":"1011326","effectiveDate":"2015-01-01T00:00:00","expirationDate":"2016-01-01T00:00:00","insuranceCompany":null,"liabilityType":"Workers' Compensation (v7)","address":{"addressLine1":"350 7th Street","addressLine2":null,"city":"Phoenix","state":"AZ","postalCode":"85254","county":"","country":"Maricopa"},"namedInsureds":[{"name":"inflectra","type":"busn_legal_nm","isPrimaryNamedInsured":"y"}],"classCodes":[{"classCode":"0035","classCodeSuffix":null,"classCodeSuffixName":"FLORIST-CULTIVATION OR GARDENING"}],"waivers":[],"statusDisplay":"Active"}],"statusDisplay":"Active"},"reportPeriodStartDate":"2015-01-01T00:00:00","reportPeriodEndDate":"2015-02-01T00:00:00","reportPeriodDueDate":"2015-02-26T00:00:00","reportingPeriodFrequency":"Monthly"}],"message":""};
			instantiateController();
			newScope.postLoadDataAction(data.data);
			expect(newScope.policies).to.be.an('array');
			expect(newScope.customerName).to.equal("Fate Brewing");
			expect(newScope.selectedPolicy).to.be.an('object');
		});

	});

});
