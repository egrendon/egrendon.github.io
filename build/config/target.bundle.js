/**
 * Method determines if Liferay AUI object exists.
 * -If it does exist then extend the session
 */
function extendSession() {
	if (typeof(AUI) == "function") {
		AUI().use('liferay-session', function(A) {
			if(Liferay.Session) {
				Liferay.Session.extend();
			}
		});
	}
}

function extendSessionWithAP() {
	extendSession();
	if(window.location.hostname !== 'localhost' && window.location.protocol !== 'file:'){
		$.ajax({
			type: 'GET',
			url: '/AgencyPortal/KeepSessionAlive',
			cache: false
		});
	}
}

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}


function getMyAccount() {

	var myAccountData = "";

	$.ajax({
		type: 'GET',
		url: '/delegate/services/api/myaccount?'+$.now(),
		headers : { 'Accept': 'application/json' },
		async : false,
		cache : false,
		success: function(data) {
			myAccountData = data;
		}
	});

	return myAccountData;
}
/**
 * Methods determine what type of ROLE
 */
function isGWUser() { return _userperms.USERTYPE === 'customer' && _userperms.USERCLASS === 'GWUSER'; }
function isPSUser() { return _userperms.USERTYPE === 'customer' && _userperms.USERCLASS === 'PSUSER'; }
function isCSRUser() { return _userperms.USERTYPE === 'employee' && _userperms.USERCLASS === 'CSRUSER'; }
function isOMNIAdmin() { return _userperms.USERTYPE === 'employee' && _userperms.USERCLASS === 'OMNIADMIN'; }
function isAGENCYManager() { return _userperms.USERCLASS === 'AGENTMANAGEMENTUSER'; }
function isUnknownUser() { return _userperms.USERTYPE === 'UNKNOWN'; }
function isAgentUser() { return _userperms.USERTYPE === 'broker' && _userperms.USERCLASS === "AGENTUSER"; }
function viewAgentAccountDelegation() { return _userperms.VIEW_AGENCY_USER_MGMT; }
function viewAgentDocumentAccount() { return _userperms.VIEW_DOC_ACCOUNT; }
function viewAgentDocumentPublic() { return _userperms.VIEW_DOC_AGENCY_PUB; }
function viewAgentDocumentPrivate() { return _userperms.VIEW_DOC_AGENCY_PRIV; }
function viewAccountService() { return _userperms.VIEW_ACCOUNT_SERVICE; }
function editAccountService() { return _userperms.EDIT_ACCOUNT_SERVICE; }
function newAccountService() { return _userperms.NEW_ACCOUNT_SERVICE; }
function submitPolicyAccountService() { return _userperms.SUBMIT_POLICY_ACCOUNT_SERVICE; }


function parseDate(date) {
	if (!date)
		return null;
	
	var date = date.split("T")[0];
	date = date.split("-");
	date = date[1] + "/" + date[2] + "/" + date[0];
	return date;
}


/**
 * Method will return the state of the status. A active state is considered to be true if any the following.
 * -active
 * -pending cancellation
 * -pending renewal
 * 
 * @param data
 * @returns {Boolean}
 */
function isConsideredActive (data) {	
	if (!data)
		return false;
	
	else if((data === 'Active') || (data === 'In Force') || (data.toLowerCase() === 'act') || (data === 'Pending Cancellation') || (data.toLowerCase() === 'pen_can')) 
		return true;
	
	return false;
}

/**
 * Method is intended to cature all the states of a status and return the correct dislpa
 * Active - green
 * Cancelled - red
 * Pending Cancellation - orange
 * Expired - gray
 * Scheduled � gray
 * 
 * @param data
 * @param policyPeriodStatus
 * @returns
 */
function getStatusLabel (data) {
	if (!data)
		return "";
	
	var statusLabel = "";
	
	if((data === 'Active') || (data === 'In Force') || (data.toLowerCase() === 'act')) {
		statusLabel = '<span class="label label-success">Active</span>';
	}
	else if((data === 'Canceled') || (data === 'Cancelled') || (data.toLowerCase() === 'can')) {
		statusLabel = '<span class="label btn-danger">Canceled</span>';	
	}
	else if((data === 'Pending Cancellation') || (data.toLowerCase() === 'pen_can')) {
		statusLabel = '<span class="label label-warning">Pending Cancellation</span>';
	}
	else if((data === 'Expired') || (data.toLowerCase() === 'xp') || (data.toLowerCase() === 'exp')) {
		statusLabel = '<span class="label">Expired</span>';
	}
	else if(data === 'Scheduled') {
		statusLabel = '<span class="label">Scheduled</span>';
	}
	else {
		statusLabel = '<span class="label">'+data+'</span>';
	}

	return statusLabel;
}

/**
 * Method will return a list of policies based on the role
 * @param policyNumber
 * @returns
 */
function getPolicyListBasedOnRole(policyNumber) {
	var policies = null;
	if (isOMNIAdmin() || isCSRUser()) {
		$.ajax({
			type: 'GET',
			url: '/delegate/services/api/policies?policyNumber='+policyNumber,
			headers : { 'Accept': 'application/json' },
			async : false,
			success : function(data) {
				policies = data.data;
			}
		});
	} else if ((myAccountData) && (myAccountData.data) && (myAccountData.data.hasOwnProperty('policies'))) {
		policies = myAccountData.data.policies;
	} else {
		window.location.replace("/web/guest/my-account#/");
	}
	return policies;
}

/**
 * Method will return the GidewireAccount
 * @param policyNumber
 * @returns
 */
function getGuidewireAccount(policyNumber) {
	var guidewireAccount = null;
	if (isOMNIAdmin() || isCSRUser()) {
		//The OMNI/CSR service does not give us the GuidewireAccount object
	} else if ((myAccountData) && (myAccountData.data) && (myAccountData.data.hasOwnProperty('guidewireAccount'))) {
		guidewireAccount = myAccountData.data.guidewireAccount;
	} else {
		window.location.replace("/web/guest/my-account#/");
	}
	return guidewireAccount;
}

/**
 * Method will capitalize the first character of a string.
 * It will also handle camelCase strings.
 * 
 * thisIsCamelCase --> This Is Camel Case 
 * this IsCamelCase --> This Is Camel Case 
 * thisIsCamelCase123 --> This Is Camel Case123
 * 
 * @param string
 * @returns
 */
function capitalizeFirstLetter(camelCase) {
    if (!camelCase || camelCase == null || camelCase == "") {
    	return "";
    }

    camelCase = camelCase.trim();
    var newText = "";
    for (var i = 0; i < camelCase.length; i++) {
      if (/[A-Z]/.test(camelCase[i]) && i != 0 && /[a-z]/.test(camelCase[i-1])) {
        newText += " ";
      }
      if (i == 0 && /[a-z]/.test(camelCase[i])) {
        newText += camelCase[i].toUpperCase();
      } else {
        newText += camelCase[i];
      }
    }
    return newText;
}

/**
 * Method will format a number string as money
 * decimal_sep: character used as deciaml separtor, it defaults to '.' 
 * thousands_sep: char used as thousands separator, it defaults to ',' 
 */
function toMoney(num){
	num = parseFloat(Math.round(num * 100) / 100).toFixed(2);
	
	var isNegNumber = num < 0;
	var preNum = num.toString().replace("-", "");
    var str = preNum.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
    if(str.indexOf(".") > 0) {
        parts = str.split(".");
        str = parts[0];
    }
    str = str.split("").reverse();
    for(var j = 0, len = str.length; j < len; j++) {
        if(str[j] != ",") {
            output.push(str[j]);
            if(i%3 == 0 && j < (len - 1)) {
                output.push(",");
            }
            i++;
        }
    }
    formatted = output.reverse().join("");
    var value = (formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
    return isNegNumber ? ("-"+value) : value;
};


// app.module.js
(function() {
    'use strict';

    angular.module('agentApp', [
        'ui.router',
        'ui.bootstrap',
        'ncy-angular-breadcrumb',
        'ngStorage',
        'agentApp.core',
        'agentApp.services',
        'agentApp.directives',
        'agentApp.menuBarModule',
        'agentApp.landingModule',
        'agentApp.agencyDocumentsModule',
        'agentApp.customerPolicyServiceModule',
        'agentApp.customerDocumentsModule',
        'agentApp.customerAccountServiceModule',
        'agentApp.accountModule',
        'agentApp.claimsModule',
        'agentApp.billingModule',
        'agentApp.historyModule',
        'agentApp.certificatesModule'
    ]);

})();

// app.routes.js
(function() {
	'use strict';

	angular
		.module('agentApp')
		.config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

	function routeConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/agent-portlet/app/featureSets/landing/landing.html',
				controller: 'LandingCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'My Account'
				}
			})
			.state('/customer-policy-service', {
				url: '/customer-policy-service',
				templateUrl: '/agent-portlet/app/featureSets/customer-policy-service/customer-policy-service.html',
				controller: 'CustomerPolicyServiceCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Policy Service'
				}
			})
			.state('/customer-policy-service/:agencyCodes', {
				url: '/customer-policy-service/:agencyCodes',
				templateUrl: '/agent-portlet/app/featureSets/customer-policy-service/customer-policy-service.html',
				controller: 'CustomerPolicyServiceCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Policy Service'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/account', {
				url: '/customer-policy-service/:agencyCodes/:accountId/account',
				templateUrl: '/agent-portlet/app/featureSets/my-account/account.html',
				controller: 'AccountCtrl',
				ncyBreadcrumb: {
					label: '{{accountId}}',
					parent: '/customer-policy-service/:agencyCodes'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/account/policies/:policyNumber', {
				url: '/customer-policy-service/:agencyCodes/:accountId/account/policies/:policyNumber',
				templateUrl: '/agent-portlet/app/featureSets/my-account/policy.html',
				controller: 'PolicyCtrl',
				ncyBreadcrumb: {
					label: '{{policyNumber}}',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/report-premium', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/report-premium',
				templateUrl: '/agent-portlet/app/featureSets/billing/report-premium.html',
				controller: 'ReportPremiumCtrl',
				ncyBreadcrumb: {
					skip: true
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/report-premium/:policyNumber', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/report-premium/:policyNumber',
				templateUrl: '/agent-portlet/app/featureSets/billing/report-premium.html',
				controller: 'ReportPremiumCtrl',
				ncyBreadcrumb: {
					label: 'Payroll Reporting',
					parent: '/customer-policy-service/:agencyCodes/:accountId/billing/:policyNumber'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/make-payment', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/make-payment',
				templateUrl: '/agent-portlet/app/featureSets/billing/pick-payment-option.html',
				controller: 'PickPaymentOptionCtrl',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					skip: true
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/make-payment/:policyNumber', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/make-payment/:policyNumber',
				templateUrl: '/agent-portlet/app/featureSets/billing/pick-payment-option.html',
				controller: 'PickPaymentOptionCtrl',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Make Payment',
					parent: '/customer-policy-service/:agencyCodes/:accountId/billing/:policyNumber'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing',
				templateUrl: '/agent-portlet/app/featureSets/billing/billing.html',
				controller: 'BillingCtrl',
				ncyBreadcrumb: {
					label: 'Account Summary',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/:policyNumber', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/:policyNumber',
				templateUrl: '/agent-portlet/app/featureSets/billing/billing.html',
				controller: 'BillingCtrl',
				ncyBreadcrumb: {
					label: '{{policyNumber}}',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/credit-card/:result', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/credit-card/:result',
				templateUrl: '/agent-portlet/app/featureSets/billing/billing.html',
				controller: 'BillingCtrl',
				ncyBreadcrumb: {
					label: '{{policyNumber}}',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/credit-card/:result/:transId/:amount', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/credit-card/:result/:transId/:amount',
				templateUrl: '/agent-portlet/app/featureSets/billing/billing.html',
				controller: 'BillingCtrl',
				ncyBreadcrumb: {
					label: '{{policyNumber}}',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/billing/report-premium/submit-report/:policyNumber/:reportPeriodDueDate', {
				url: '/customer-policy-service/:agencyCodes/:accountId/billing/report-premium/submit-report/:policyNumber/:reportPeriodDueDate',
				templateUrl: '/agent-portlet/app/featureSets/billing/submit-report.html',
				controller: 'SubmitReportCtrl',
				ncyBreadcrumb: {
					label: 'Submit Report',
					parent: '/customer-policy-service/:agencyCodes/:accountId/billing/report-premium/:policyNumber'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/claims', {
				url: '/customer-policy-service/:agencyCodes/:accountId/claims',
				templateUrl: '/agent-portlet/app/featureSets/claims/claims.html',
				controller: 'ClaimsCtrl',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Claims',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/certificates', {
				url: '/customer-policy-service/:agencyCodes/:accountId/certificates',
				templateUrl: '/agent-portlet/app/featureSets/certificates/certificates.html',
				controller: 'CertificatesCtrl',
				ncyBreadcrumb: {
					label: 'Certificates',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/certificates/:policyNumber/:policyPeriodId', {
				url: '/customer-policy-service/:agencyCodes/:accountId/certificates/:policyNumber/:policyPeriodId',
				templateUrl: '/agent-portlet/app/featureSets/certificates/certificates.html',
				controller: 'CertificatesCtrl',
				ncyBreadcrumb: {
					label: 'Certificates',
					parent: '/customer-policy-service/:agencyCodes/:accountId/account'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/certificates/edit/:policyNumber/:policyPeriodId/:certificateId', {
				url: '/customer-policy-service/:agencyCodes/:accountId/certificates/edit/:policyNumber/:policyPeriodId/:certificateId',
				templateUrl: '/agent-portlet/app/featureSets/certificates/certificate.html',
				controller: 'CertificateCtrl',
				ncyBreadcrumb: {
					label: 'View Certificate',
					parent: '/customer-policy-service/:agencyCodes/:accountId/certificates/:policyNumber/:policyPeriodId'
				}
			})
			.state('/customer-policy-service/:agencyCodes/:accountId/certificates/new/:policyNumber/:policyPeriodId/', {
				url: '/customer-policy-service/:agencyCodes/:accountId/certificates/new/:policyNumber/:policyPeriodId/',
				templateUrl: '/agent-portlet/app/featureSets/certificates/new-certificate.html',
				controller: 'CreateCertificateCtrl',
				ncyBreadcrumb: {
					label: 'New Certificate',
					parent: '/customer-policy-service/:agencyCodes/:accountId/certificates/:policyNumber/:policyPeriodId'
				}
			})
			.state('/customer-documents', {
				url: '/customer-documents',
				templateUrl: '/agent-portlet/app/featureSets/customer-documents/documents-landing.html',
				controller: 'CustomerDocumentsLandingCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Documents'
				}
			})
			.state('/customer-documents/:agencyCodes', {
				url: '/customer-documents/:agencyCodes',
				templateUrl: '/agent-portlet/app/featureSets/customer-documents/documents-landing.html',
				controller: 'CustomerDocumentsLandingCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Documents'
				}
			})
			.state('/customer-documents/:agencyCodes/:accountId', {
				url: '/customer-documents/:agencyCodes/:accountId',
				templateUrl: '/agent-portlet/app/featureSets/customer-documents/documents-summary.html',
				controller: 'CustomerDocumentsSummaryCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: '{{vm.accountId}}',
					parent: '/customer-documents/:agencyCodes'
				}
			})
			.state('/customer-account-service', {
				url: '/customer-account-service',
				templateUrl: '/agent-portlet/app/featureSets/customer-account-service/account-management-iFrame.html',
				controller: 'AccountManagementSearchCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Account Service'
				}
			})
			.state('/customer-account-service/:pastFirstClick', {
				url: '/customer-account-service/:pastFirstClick',
				templateUrl: '/agent-portlet/app/featureSets/customer-account-service/account-management-iFrame.html',
				controller: 'AccountManagementSearchCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Account Service'
				}
			})
			.state('/agency-documents', {
				url: '/agency-documents',
				templateUrl: '/agent-portlet/app/featureSets/agency-documents/agency-documents.html',
				controller: 'AgencyDocumentsCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Agency Documents'
				}
			})
			.state('/agency-documents/:agencyCodes', {
				url: '/agency-documents/:agencyCodes',
				templateUrl: '/agent-portlet/app/featureSets/agency-documents/agency-documents.html',
				controller: 'AgencyDocumentsCtrlAs',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Agency Documents'
				}
			});
	}

})();

// exception.module.js
(function () {
    'use strict';
    angular.module('blocks.exception', ['blocks.logger']);
})();
// exception-handler.js
// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function () {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionConfig', exceptionConfigProvider)
        .config(exceptionConfig);

    // Must configure the service and set its
    // events via the exceptionConfigProvider
    function exceptionConfigProvider() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            //appErrorPrefix: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    }

    exceptionConfig.$inject = ['$provide'];

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).
    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'exceptionConfig', 'logger'];

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, exceptionConfig, logger) {
        var appErrorPrefix = exceptionConfig.config.appErrorPrefix || '';
        return function (exception, cause) {
            $delegate(exception, cause);
            var errorData = { exception: exception, cause: cause };
            var msg = appErrorPrefix + exception.message;
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             *
             */
            
            var hostName = window.location.host;
            var isLocal = hostName.indexOf("localhost") > -1;
            var isDev  = hostName.indexOf("consumer-dev.copperpoint.com") > -1;
            //Enable logger for LOCAL and DEV ONLY
            if (isLocal || isDev)
            	logger.error(msg, errorData);
        };
    }

})();
// exception.js
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);

    exception.$inject = ['logger'];

    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
})();

// logger.module.js
(function() {
    'use strict';
    angular.module('blocks.logger', []);
})();

// logger.js
(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,

            // straight to console; bypass toastr
            log: $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());

// router.module.js
(function() {
    'use strict';

    angular.module('blocks.router', [
        //'ngRoute',
        'blocks.logger'
    ]);

})();

// routehelper.js
(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    routehelper.$inject = ['$location', '$rootScope', '$route', 'logger', 'routehelperConfig'];

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    function routehelper($location, $rootScope, $route, logger, routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var routes = [];
        var $routeProvider = routehelperConfig.config.$routeProvider;

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;
        ///////////////

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.config.resolveAlways);
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            for (var prop in $route.routes) {
                if ($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        routes.push(route);
                    }
                }
            }
            return routes;
        }

        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function(event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();

// core.module.js
(function() {
    'use strict';

    angular.module('agentApp.core', [
        //'ngAnimate',
        'ngSanitize',
        //'blocks.exception',
        'blocks.logger',
        'blocks.router'
    ]);
})();

// constants.js
/* global toastr:false, moment:false */
(function() {
	'use strict';

	angular
		.module('agentApp.core')
		.constant('toastr', toastr)
		.constant('moment', moment)
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

// config.js
(function() {
    'use strict';

    angular.module('agentApp.core')
        .config(toastrConfig)
        //.config(configure)
        .config(breadcrumbConfig)
        .config(localStorageConfig)
        .value('config', {
            appErrorPrefix: '[Agent Portlet] ',
            appTitle: 'Agent Portlet',
            version: '1.0.0'
        });

    toastrConfig.$inject = ['toastr'];

    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    breadcrumbConfig.$inject = ['$breadcrumbProvider'];

    function breadcrumbConfig($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home',
            template: 'bootstrap2'
        });
    }

	localStorageConfig.$inject = ['$localStorageProvider', '$windowProvider'];

    function localStorageConfig($localStorageProvider, $windowProvider) {
		/*
		$window service can not be injected in config()
		but we can get an instance of it via provider
		*/
		var $window = $windowProvider.$get();
		$localStorageProvider.setKeyPrefix($window.Liferay.ThemeDisplay.getUserId());
    }

    //configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionConfigProvider'];

    /*function configure($logProvider, $routeProvider, routehelperConfigProvider, exceptionConfigProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'agent Portlet: ';

        // Configure the common exception handler
        exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
    }*/

})();

// custom.js
/**
 * Method will observer a click on Consumer Portal Logout button then fire a logout request to Agency Portal
 */
$(document).ready(function() {
    $('.c-portal-logout').click(function(event) {
        var hostName = window.location.host;
        var isLocal = hostName.indexOf("localhost") > -1;
        var logoutURL = "";
        //Workaround for LOCAL ONLY
        if (isLocal)	
        	logoutURL = "http://localhost:8080/AgencyPortal/ProcessLogoff";
        else        	
        	logoutURL = "/AgencyPortal/ProcessLogoff";
    	
        $.ajax({
            type: 'GET',
            url: logoutURL,
            async:   false,
            cache : false
        });
    });
});

// directives.module.js
(function() {
    'use strict';

    angular.module('agentApp.directives', ['ui.bootstrap']);

})();
// messagePanel.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('messagePanel', messagePanel);

    function messagePanel() {
        var directive = {
            link: link,
            restrict: 'AE',
			scope : {
	            "message": "@message",
	            "messages": "@messages",
	            "flashMessage":"@flashMessage"
			},
	        template: '<div id="messagePanelId" class="messagePanel">'+
			        	'<alert ng-repeat="alert in alerts" type="alert.type" close="close($index)">'+
			        		'<strong ng-if="alert.title">{{alert.title}}&nbsp;&nbsp;</strong>{{alert.msg}}'+
			        	'</alert>'+
			          '</div>',
			replace : true, //element to which the directive declared should be replaced with template
			controller: controller
        };

        return directive;

        function link(scope, element, attrs) {
            /**
             * Method to close a message row
             */
        	scope.close = function(index) {
            	scope.alerts.splice(index, 1);
        	};

        	scope.$watch(function() {return element.attr('message'); }, function(newValue){
        		var myMessage = element.attr('message');
        		if (myMessage && myMessage.length > 0) {
                    // Call Message Processing Actions
                    scope.preProcessMessageAction();
                    scope.addToMsgList();
        		}
        	});
        	scope.$watch(function() {return element.attr('messages'); }, function(newValue){
        		var myMessages = element.attr('messages');
        		if (myMessages && myMessages.length > 0) {
                    // Call Message Processing Actions
                    scope.preProcessMessagesAction();
                    scope.addToMsgList();
        		}
        	});
        	scope.$watch(function() {return element.attr('flash-message'); }, function(newValue){
        		var myFlashMessage = element.attr('flash-message');
        		if (myFlashMessage && myFlashMessage.length > 0) {
                    // Call Message Processing Actions
                    scope.preProcessFlashMessageAction();
                    scope.addToMsgList();
        		}
        	});
        }

        function controller($scope) {
			// initialize
            $scope.alerts = [];
            //Sample messsages
//            $scope.alerts = [
//                 { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
//                 { type: 'success', title: "Success!", msg: 'Well done! You successfully read this important alert message.' },
//                 { type: 'warning', msg: 'Another alert!' },
//                 { type: 'info', msg: 'do you have any ideas, why ?' },
//                 { type: 'error', msg: 'this an error message....' }
//            ];

            $scope.preProcessMessageAction = function() {
            	if ($scope.message === "{}") {
            		$scope.message = "";
            		return;//do nothing
            	}

            	if ($scope.message && $scope.message.length > 0) {
            		var containsJsonSyntax = $scope.message.indexOf("{") >= 0 && $scope.message.indexOf("}") >= 0;
            		if (containsJsonSyntax) {
            			var jsonObj = JSON.parse($scope.message);
            			$scope.message = jsonObj;
            		}
            		if (!containsJsonSyntax && (typeof $scope.message == 'string' || $scope.message instanceof String)) {
		            	// msg it's a string
		            	var indexOfColon = $scope.message.indexOf(":");
		            	var indexOfColonNext = $scope.message.indexOf(":")+1;
		            	var typeOnly = $scope.message.substring(0, indexOfColon);
		            	var msgOnly = $scope.message.substring(indexOfColonNext, $scope.message.length);
		            	$scope.message =  { type: typeOnly, msg: msgOnly};
		            }
            	}
            	else $scope.message = "";//set to empty
            };

            $scope.preProcessMessagesAction = function() {
            	if ($scope.messages === "[]") {
            		$scope.messages = "";
            		return;//do nothing
            	}

            	if ($scope.messages && $scope.messages.length > 0) {
            		var containsJsonSyntax = $scope.messages.indexOf("{") >= 0 && $scope.messages.indexOf("}") >= 0;
	            	if (containsJsonSyntax) {
	            		var jsonArray = JSON.parse($scope.messages);
	            		$scope.messages = jsonArray;
	            	}
            	}
            	else $scope.messages = "";//set to empty
            };

            $scope.preProcessFlashMessageAction = function() {
            	if ($scope.flashMessage === "{}") {
            		$scope.flashMessage = "";
            		return;//do nothing
            	}

            	if ($scope.flashMessage && $scope.flashMessage.length > 0) {
            		var containsJsonSyntax = $scope.flashMessage.indexOf("{") >= 0 && $scope.flashMessage.indexOf("}") >= 0;
	            	if (containsJsonSyntax) {
	            		var jsonObj = JSON.parse($scope.flashMessage);
	            		jsonObj['msg'] = jsonObj.body;
	            		$scope.flashMessage = jsonObj;
	            	}
            	}
            	else $scope.flashMessage = "";//set to empty
            };

            $scope.addToMsgList = function() {
	            if ($scope.message) {
	            	$scope.alerts.push($scope.message);
	            }
	            if ($scope.messages) {
	            	for (var i = 0; i < $scope.messages.length; i++) {
						var msgTemp = $scope.messages[i];
						$scope.alerts.push(msgTemp);
					}
	            }
	            if ($scope.flashMessage) {
	            	$scope.alerts.push($scope.flashMessage);
	            }
            };

//            // Call Message Processing Actions
//            $scope.preProcessMessageAction();
//            $scope.preProcessMessagesAction();
//            $scope.preProcessFlashMessageAction();
//            $scope.addToMsgList();
		}
    }
})();

// topMenu.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('topMenu', topMenu);

    function topMenu() {
        var directive = {
            restrict: 'EA',
            scope: {
                menu: '=',
            },
            //Include user-defined HTML
            transclude: true,
            //We want to deal with a template
            templateUrl: '/agent-portlet/app/core/directives/topMenu.directive.html',

            controller: ['$scope', '$element', '$attrs', '$transclude',
                function($scope, $element, $attrs, $transclude) {
                    // initialize
                    var defaultMenuObj = {
                        accountName: "",
                        agencyCodes: "",
                        accountId: "",
                        role: null
                    };
                    //default values
                    if (!$scope.menu) {
                    	$scope.menu = defaultMenuObj;
                    }

                    function policyNumberURL() {
                        var policyNumberStr = "";
                        if ($scope.menu && $scope.menu.policyNumber) {
                            policyNumberStr = "/" + $scope.menu.policyNumber;
                        }
                        return policyNumberStr;
                    }

                    function accountIdURL() {
                        var str = "";
                        if ($scope.menu && $scope.menu.accountId) {
                            str = "/" + $scope.menu.accountId;
                        }
                        return str;
                    }

                    function agencyCodesURL() {
                        var str = "";
                        if ($scope.menu && $scope.menu.agencyCodes) {
                            str = "/" + $scope.menu.agencyCodes;
                        }
                        return str;
                    }

                    $scope.myAccountURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/account";
                    };
                    $scope.billingURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/billing" + policyNumberURL();
                    };
                    $scope.paymentURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/billing/make-payment" + policyNumberURL();
                    };
                    $scope.reportingURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/billing/report-premium" + policyNumberURL();
                    };
                    $scope.claimsURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/claims" + policyNumberURL();
                    };
                    $scope.certsURL = function() {
                        return "/web/guest/my-account-agent#/customer-policy-service" + agencyCodesURL() + accountIdURL() + "/certificates" + policyNumberURL();
                    };
                }
            ]
        };

        return directive;

    }
})();

// reallyClick.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('reallyClick', reallyClick);

    function reallyClick() {

        var directive = {
            link: link,
            restrict: 'AE'
        };

        return directive;

        function link(scope, element, attrs) {
            element.bind('click', function() {
                var msgAttributeValue = attrs.ngReallyMessage;
                var message = null;
                //
                //If msgAttributeValue is actually a function call. Eval the function and assumes function returns a message string. 
                //else assign message varaible equal to msgAttributeValue (backwards compatible behavior)
                if (msgAttributeValue.indexOf("()") != -1)
                    message = scope.$apply(msgAttributeValue);
                else
                    message = msgAttributeValue;

                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
})();

// datatable.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('myTable', myTable);

    function myTable() {
        var directive = {
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            // apply DataTable options, use defaults if none specified by user
            var options = {};
            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    stateSave: true,
                    stateDuration: 2419200 /* 1 month */
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller
            //            var explicitColumns = [];
            //            element.find('th').each(function(index, elem) {
            //                explicitColumns.push($(elem).text());
            //            });
            //            if (explicitColumns.length > 0) {
            //                options.aoColumns = explicitColumns;
            //            } else if (attrs.aoColumns) {
            //                options.aoColumns = scope.$eval(attrs.aoColumns);
            //            }

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options.aoColumnDefs = scope.$eval(attrs.aoColumnDefs);
            }

            if (attrs.fnRowCallback) {
                options.fnRowCallback = scope.$eval(attrs.fnRowCallback);
            }

            if (attrs.footerCallback) {
                options.footerCallback = scope.$eval(attrs.footerCallback);
            }

            // apply the plugin
            var dataTable = element.dataTable(options);

            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function(value) {
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    var listData = scope.$eval(attrs.aaData);
                    //If aaData empty then dont eval and fnAddData
                    if (listData && listData.length > 0) {
                        dataTable.fnAddData(listData);
                    }
                }
            });            
            
            /********************************************************************************/
            /**
             *  START of Column RANGE Search
             */
            /********************************************************************************/
            // watch for any changes to RANGE data and then preform search if data changes happened
            if (attrs.searchRangeColumnDefs) {
	            scope.$watch(attrs.searchRangeData, function(dataRangeMap) {
	                var searchRangeColumnDefs = scope.$eval(attrs.searchRangeColumnDefs);
	            	if (searchRangeColumnDefs.columnIndexes.length != searchRangeColumnDefs.dataMapKeys.length) {
	            		throw new Error("columnIndexes.length must be a 1-to-1 with dataMapKeys.length");
	            		return;//do nothing
	            	}
	               	                
	                for (var j = 0; j < searchRangeColumnDefs.columnIndexes.length; j++) { 
	                	var index = searchRangeColumnDefs.columnIndexes[j];
	                	var dataMapKey = searchRangeColumnDefs.dataMapKeys[j];
	                	var mapValue = dataRangeMap[dataMapKey];
	                	if (mapValue) {
	                		applyRANGESearchOnColumnIndex(index, mapValue.min, mapValue.max);
	                	}
	                }
	            }, true);
            }
            
            function applyRANGESearchOnColumnIndex(columnIndex, minValue, maxValue) {
                var tableId = "#" + attrs.id;
                var jQElement = $(tableId);
                var datatable = jQElement.DataTable(); //datatable            
            	
            	//
                // NOTE: A filter pop makes the range filter temporary, i.e when the user changed the 
                // values you want to apply different filters. If you wanted a filter that always applied 
                // you would not pop. But becauase data is dyanmically changing we pop after each range search.
                jQuery.fn.dataTable.ext.search.pop(); 
                
                // After poping the old filter apply the new filter
            	if (columnIndex === undefined || columnIndex === null) {
            		datatable.draw(); //because filter is already poped just redraw table and it should the full list
            		return; //do nothing else
                }
                if (minValue === undefined || minValue === null) {
                	datatable.draw(); //because filter is already poped just redraw table and it should the full list
                	return; //do nothing else
                }
                if (maxValue === undefined || maxValue === null) {
                	datatable.draw(); //because filter is already poped just redraw table and it should the full list
                	return; //do nothing else
                }
                
                jQuery.fn.dataTableExt.search.push(
                    function(settings, data, dataIndex) {                    	
                    	var min = parseFloat(minValue, 10);
                        var max = parseFloat(maxValue, 10);
                        var columnObj = data[columnIndex];
                        var someValue = parseFloat(columnObj) || 0; // use data for the someValue column

                        if ((isNaN(min) && isNaN(max)) ||
                            (isNaN(min) && someValue <= max) ||
                            (min <= someValue && isNaN(max)) ||
                            (min <= someValue && someValue <= max)) {
                            return true;
                        }
                        return false;
                    }
                );
                //after defining filter redraw the table
                datatable.draw();
            }
            /********************************************************************************/
            /**
             *  END of Column RANGE Search
             */
            /********************************************************************************/




            /********************************************************************************/
            /**
             *  START of Column OR Search
             */
            /********************************************************************************/
            // watch for any changes to OR data and then preform search if data changes happened
            if (attrs.searchOrColumnDefs) {
	            scope.$watch(attrs.searchOrData, function(dataORMap) {
	                var searchOrColumnDefs = scope.$eval(attrs.searchOrColumnDefs);
	            	if (searchOrColumnDefs.columnIndexes.length != searchOrColumnDefs.dataMapKeys.length) {
	            		throw new Error("columnIndexes.length must be a 1-to-1 with dataMapKeys.length");
	            		return;//do nothing
	            	}
	                for (var k = 0; k < searchOrColumnDefs.columnIndexes.length; k++) { 
	                	var index = searchOrColumnDefs.columnIndexes[k];
	                	var dataMapKey = searchOrColumnDefs.dataMapKeys[k];
	                	var mapValue = dataORMap[dataMapKey];
	                	if (!mapValue) {
	                		//null and undefined values are valid let it pass thru
	                		applyORSearchOnColumnIndex(index, mapValue, dataMapKey);
	                	}
	                	else if (mapValue && mapValue.constructor == Array) {
	                		applyORSearchOnColumnIndex(index, mapValue);
	                	}
	                	else {
	                		var valueArray = mapValue.toString().split(",");
	                    	applyORSearchOnColumnIndex(index, valueArray);
	                	}
	                }
	            }, true);
            }
            /**
             * Datatables 1.10 API search()
             * 
             * 1    input   string          No
             * Search string to apply to the table.
             * 
             * 2    regex   boolean     Yes - default:false
             * Treat as a regular expression (true) or not (default, false).
             * 
             * 3    smart   boolean         Yes - default:true
             * Perform smart search (default, true) or not (false). See below for a description of smart searching.
             * Note that to perform a smart search, DataTables uses regular expressions, so if enable regular expressions 
             * using the second parameter to this method, you will likely want to disable smart searching as the two regular 
             * expressions might otherwise conflict and cause unexpected results.
             * 
             * 4    caseInsen   boolean     Yes - default:true
             * Do case-insensitive matching (default, true) or not (false).
             * 
             */
            function applyORSearchOnColumnIndex(columnIndex, valueArray) {
                if (columnIndex === undefined || columnIndex === null) {
                	return; //do nothing
                }
            	
            	var tableId = "#" + attrs.id;
                var jQElement = $(tableId);
                var datatable = jQElement.DataTable(); //datatable

                //do OR search on column
                if (valueArray && valueArray.length > 0) {                    
                    var columnSearchTermOR = valueArray.join("|");

                    datatable
                        .column(columnIndex).search(columnSearchTermOR, true, false)
                        .draw();
                }
                //clear OR search on column
                else {
                    datatable
                        .column(columnIndex).search("", true, false)
                        .draw();
                }
            }
            /********************************************************************************/
            /**
             *  END of Column OR Search
             */
            /********************************************************************************/



            /********************************************************************************/
            /**
             *  START of Custom Column Sorters
             */
            /********************************************************************************/
            /* Method adds a custom sort 'policyPeriod_expDate' specifying the asc order impl method **/
            jQuery.fn.dataTableExt.oSort['policyPeriod_expDate-asc'] = function(x, y) {
                x = getDateValue(x);
                y = getDateValue(y);

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            };

            /* Method adds a custom sort 'policyPeriod_expDate' specifying the desc order impl method **/
            jQuery.fn.dataTableExt.oSort['policyPeriod_expDate-desc'] = function(x, y) {
                x = getDateValue(x);
                y = getDateValue(y);

                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            };
            /*
             * Method adds a custom sort 'policyPeriod_expDate' helper method parses the passed in
             * value to find the date value. And returns a date object. NOTE: Method assumes the
             * passed in value is surrounded by span tag.
             * example : <span id="expirationDate0">08/22/2015</span>
             */
            function getDateValue(value) {
                if (value === null || value.lastIndexOf("<span id='expirationDate0'>") == -1)
                    return null;

                var spanIdx = value.lastIndexOf("<span id='expirationDate0'>");
                var startIndex = spanIdx + 27;
                var endIndex = startIndex + 10;
                var dateStrg = value.substring(startIndex, endIndex);
                //Convert date string to dateObj
                var parts = dateStrg.split('/');
                var mydate = new Date(parts[2], parts[0] - 1, parts[1]);
                return mydate;
            }
            /********************************************************************************/
            /**
             *  END of Custom Column Sorters
             */
            /********************************************************************************/
        }
    }
})();

// myMaxLength.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('cpmiMyMaxlength', cpmiMyMaxlength);


    /**
     * Custom Directive that is used to invoke the ng-valiation message for a field that has exceeed the max-length.
     * Note:  The directive assumes the field has 'name' attribute else throwns a helpful exception 
     */
    function cpmiMyMaxlength() {

        var directive = {
            link: link,
            restrict: 'AE',
            require : 'ngModel'
        };

        return directive;
        
        function link(scope, element, attrs, ngModelCtrl) {
			var yourFieldName = element.attr('name');
			// Try to help the developer with a useful error message in case they forget the 'name' attribute
			if ((typeof(yourFieldName) === "undefined") || element.attr('name') === null)
				throw "The 'name' attribute is required for the cpmiMyMaxlength directive.";
			
			var maxlength = Number(attrs.cpmiMyMaxlength);
			scope.$watch(attrs.ngModel, function (newValue, oldValue) {
				if (newValue) {
					var isValid = newValue.length <= maxlength;
					if (isValid) 
						ngModelCtrl.$setValidity(yourFieldName, true);
		            else 
		            	ngModelCtrl.$setValidity(yourFieldName, false);
				}
	            	
			}, true);	
        }
    }
})();

// routingNumber.directive.js
(function() {
    'use strict';

    angular
        .module('agentApp.directives')
        .directive('isRoutingNumber', isRoutingNumber);

    function isRoutingNumber() {

        var directive = {
            link: link,
            restrict: 'AE',
            require : 'ngModel'
        };

        return directive;
        
        function link(scope, element, attrs, ngModel) {

            function checkABA(value) {
                if(value) {
                    var i, n, t;

                    t = "";
                    for (i = 0; i < value.length; i++) {
                        var c = parseInt(value.charAt(i), 10);
                        if (c >= 0 && c <= 9)
                          t = t + c;
                    }

                    if (t.length != 9)
                        return false;

                    n = 0;
                    for (i = 0; i < t.length; i += 3) {
                        n += parseInt(t.charAt(i),     10) * 3
                          +  parseInt(t.charAt(i + 1), 10) * 7
                          +  parseInt(t.charAt(i + 2), 10);
                    }

                    if (n != 0 && n % 10 == 0)
                        return true;
                    else
                        return false;
                }
                else 
                	return false;
            }

           //For DOM -> model validation
          ngModel.$parsers.unshift(function(value) {
             var valid = checkABA(value);
             
             ngModel.$setValidity('isRoutingNumber', valid);
             return valid ? value : undefined;
          });

          //For model -> DOM validation
          ngModel.$formatters.unshift(function(value) {
        	  var valid = checkABA(value);
        	  
              ngModel.$setValidity('isRoutingNumber', valid);
              return valid ? value : undefined;
          });
      
        }
    }
})();

// loader.directive.js
(function() {
    'use strict';

    angular.module('agentApp.directives')
        .directive('cpmiLoader', cpmiLoader);

        function cpmiLoader() {
            var directive = {
                restrict: 'A',
                template: '<div class="loader ng-cloak" ng-hide="cpmiContentLoaded"></div>',
                scope: {
                    cpmiContentLoaded: '='
                }
            };
            return directive;
        }

})();

// iFrameResize.directive.js
/**
 * Directive uses jquery.iframeResizer library to autoresize the iFrame
 * The following are the options that are being set for jquery.iframeResizer library
 * refer to http://davidjbradshaw.github.io/iframe-resizer/#iframe-methods
 * NOTE: That  iframeResizer.contentWindow.min.js must be included on the destiantion web application for this to work
 * 
 * Directive will callback a method 'on-load callback' when iframe has completed loading content
 */
(function() {
    'use strict';

    angular.module('agentApp.directives')
        .directive('cpmiResizeIframe', cpmiResizeIframe);

    function cpmiResizeIframe() {
        var directive = {
            link: link,
            restrict: 'AE',
            scope: {
                callBackMethod: '&onLoadCallback'
            }
        };

        return directive;

        function link(scope, element, attrs) {
            //
            // Set jquery.iframeResizer options
            //
            var options = {
                log: false, // Enable console logging
                enablePublicMethods: true, // Enable methods within iframe hosted page
                interval: 250, // Interval to check resize
                //heightCalculationMethod: 'documentElementOffset', // Calc uses document.documentElement.offsetHeight
                heightCalculationMethod: 'lowestElement', // Calc uses document.documentElement.offsetHeight
                scrolling: false // Enable scroll bars in iFrame
            };
            var iFrameElement = element.iFrameResize(options);

            //
            // Enable busy indicator for iframe when flag marked at true
            //
            if (attrs.enableIframeLoadedIndiator) {
                element.bind('load', function() {
                    checkIframeLoaded();
                });
            }


            //
            // Set callback a method 'on-load callback' when iframe has completed loading content
            //
            function checkIframeLoaded() {
            	try {
                    // Get the iframe element
                    var iFrameElement = element[0];
                    var iframeDoc = iFrameElement.contentDocument || iFrameElement.contentWindow.document;
                    // Check if loading is complete
                    if (iframeDoc.readyState == 'complete') {
                        // The loading is complete, call the function we want executed once the iframe is loaded
                        return scope.callBackMethod();
                    }

                    // If we are here, the iFrame is not loaded. Set things up so we check the status again in 100 milliseconds
                    $timeout(
                        function() {
                            checkIframeLoaded();
                        }, 100);
            		
				} 
            	//In case of any error do the callback before throwing the exception
            	catch (e) {
            		//
            		// First do the callBack 
            		//
            		scope.callBackMethod();
            		//
            		// Then throw the exeception 
            		//
            		// NOTE: We know that a exeception will bubble here if the AgencyPortal session is expired. 
            		// The special case happens whenever the session is no longer active in AgencyPortal, iFrame is 
            		// then directed to F5 log in page which seems to be a differing origin thus the auto resize code 
            		// that is being called is forcing this error to happen which is the browser preventing ClickJacking.
            		//
            		// Example of special case error --> SecurityError: Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "xxxxxxxxxxxx" from accessing a cross-origin frame.
            		//
            		throw "Directive iFrameResize.directive.js detected error ------ "+e;
				}
            }
        }//End link function
    }
})();

// loader.directive.js
(function() {
    'use strict';

    angular.module('agentApp.directives')
        .directive('cpmiTruncate', cpmiTruncate);

        function cpmiTruncate($window) {
            var directive = {
                restrict: 'A',
                template: "<span ng-if='isTruncateEnabled'>{{ value | limitTo: myLength }}{{value.length > myLength ? '...' : ''}}</span>" +
                		 "<span ng-if='!isTruncateEnabled'>{{value}}</span>",
                scope: {
                	value: '=',
                	length: '=',
                	smallMobileModeOnly: '='
                },
                link: link
            };
            return directive;
            
            
            function link(scope, element, attrs) {
                //
                // Enable truncte length
                //
                if (attrs.length) {
                    scope.myLength = attrs.length;
                }
                else {
                	scope.myLength = 30; //default value
                }
                //
                // initial mobileCheck
                //
                mobileCheck();
                //
                // On window resize call
                //
                angular.element($window).on('resize', function( e ) {
                	mobileCheck();
                	scope.$apply();
                });
                
                //
                //  Enable truncte for small mobile only
                //
                function mobileCheck() {
                    if (attrs.smallMobileModeOnly && attrs.length) {
                    	scope.clientWidth = document.documentElement.clientWidth;
            	    	//matches @media (max-width: 768px)
            	    	var isBrowserInSmallMobileMode =  scope.clientWidth < 768;
            	    	scope.isTruncateEnabled = isBrowserInSmallMobileMode;            	    	
                    } 
                };
            }
        }

})();

// accountAlert.directive.js
(function () {
	'use strict';

	angular
		.module('agentApp.directives')
		.directive('cpmiAccountAlert', cpmiAccountAlert);

	cpmiAccountAlert.$inject = ['$location', 'agentCustomers'];

	function cpmiAccountAlert($location, agentCustomers) {
		function resolveTemplate(tElement, tAttrs) {
			var template;
			if(tAttrs.calledFrom === 'landing'){
				template = '<div class="{{getAlertClass(type, \'landing\')}}" ng-click="clickAction()">'+
								'<span ng-bind-html="getLandingPageMessage(type)"></span>'+
							'</div>';
			}
			else{
				template = '<div class="{{getAlertClass(type, \'policyService\')}}">'+
								'<a type="button" class="close" data-dismiss="alert" ng-click="clickAction()">&times;</a>'+
								'<span ng-bind-html="getGeneralPageMessage(type)"></span>'+
							'</div>';
			}
			return template;
		}
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				clickAction: '&',
				type: '=',
				length: '=',
				date: '=',
				time: '=',
				calledFrom: '='
			},
			template: resolveTemplate,
			controller: ['$scope',
				function ($scope) {

					$scope.getAlertClass = function (type, calledFrom) {
						calledFrom = calledFrom || 'landing';
						var selectedClasses;
						switch (type) {
							case "new":
								selectedClasses = 'account-alert alert';
								break;
							case "renewal":
								selectedClasses = 'account-alert alert alert-info';
								break;
							case "cancellation":
								selectedClasses = 'account-alert alert alert-error';
								break;
							default:
								selectedClasses = 'account-alert alert';
						}
						if(calledFrom !== 'landing'){
							return selectedClasses.replace('account-alert', '');
						}
						return selectedClasses;
					};

					$scope.getLandingPageMessage = function (type) {						
						switch (type) {
							case "new":
								return ''+$scope.length+' new customer(s) <strong>available since the last time you logged in.</strong> Click here to see who they are.';
								break;
							case "renewal":
								return ''+$scope.length+' customer(s) <strong>approaching renewal within the next 90 days.</strong> Click here to see who they are.';
								break;
							case "cancellation":
								return 'You have '+$scope.length+' customer(s) <strong>currently Pending Cancellation.</strong> Click here to see who they are.';
								break;
							default:
								return 'There are <strong>'+$scope.length+'</strong> customer(s).';
						}
					};
					
					$scope.getGeneralPageMessage = function (type) {
						var dateTime = $scope.date+" "+$scope.time;
						switch (type) {
							case "new":
								return ''+$scope.length+' new customer(s) as of your '+dateTime+' log in. <p/> Close this message to see all your customers.';
								break;
							case "renewal":
								return ''+$scope.length+' customer(s) as of '+dateTime+' approaching renewal within the next 90 days. <p/> Close this message to see all your customers.';
								break;
							case "cancellation":
								return ''+$scope.length+' customer(s) as of '+dateTime+' currently Pending Cancellation. <p/> Close this message to see all your customers.';
								break;
							default:
								return 'There are <strong>'+$scope.length+'</strong> customer(s).';
						}
					};
				}
			]
		};
	}
})();

// Role.js
(function() {
	'use strict';
	window.MODEL = window.MODEL || {};
}());

//Role Object treated as a module
MODEL.Role = (function() {
	'use strict';

	var permDefault = {
		certsView : false,
		certsSave : false,
		certsCreate : false,
		certsDelete : false,
		claimView : false,
		claimSubmit : false,
		billView : false,
		billReport : false,
		billPayCC : false,
		billPayACH : false,
		isCSRorOMNI: false,
        isAgentUser: false,
        viewCustomerAccountDelegation: false,
		viewAgentAccountDelegation: false,
		viewAgentDocumentAccount: false,
		viewAgentDocumentPublic: false,
		viewAgentDocumentPrivate: false
		
	};

	/**
	 * Role constructor used to create a Role instance.
	 * @param type Policy policy
	 **/
	function Role(policy) {
		//Adding the variable policy to each object instance
		this.policy = policy;

		if (this.perm === undefined || this.perm === null)
			this.perm = permDefault;
	}

	/**
	 * Shared prototype object on every instance of Role.
	 **/
	Role.prototype = {

		//Resetting the prototype constructor property to point Role not Object
		constructor : Role,

		/**
		 * Get the policy
		 **/
		getPolicy : function() {
			return this.policy;
		},

		/**
		 * Get the policy
		 **/
		setPolicy : function(policy) {
			this.policy = policy;
		},

		getPerm : function() {
			return this.perm;
		},

		/**
		 * Clear Perms object to default
		 **/
		resetPermissions : function() {
			this.perm = permDefault;
		},

		/**
		 * Stringify the Perm object.
		 **/
		permToString : function() {
			if (this.perm)
				return JSON.stringify(this.perm);
			else
				return "null";
		},
		/**
		 * Stringify the Policy object.
		 **/
		policyToString : function() {
			if (this.policy)
				return JSON.stringify(this.policy);
			else
				return "null";
		},
		/**
		 * Stringify the Role object.
		 **/
		toString : function() {
			var output = 'policy=' + this.policyToString() + "         perms="+ this.permToString();
			return output;
		}
	};

	//Return reference to the Role Object Constructor
	return Role;
}());

/** Declare a window variable **/
angular.module('agentApp.services', [])
	.value('Role', MODEL.Role);

// services.module.js
(function() {
    'use strict';

    angular.module('agentApp.services', ['ngResource']);

})();
// documentData.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('documentData', documentData);

	documentData.$inject = ['$resource', 'serviceConfigObject'];

	function documentData($resource, serviceConfigObject) {
		return {
			getAgentAccounts: $resource('/delegate/services/api/customer-documents/accounts/:agencyCodes', {
				agencyCodes: '@agencyCodes'
			}, serviceConfigObject),
			getAccountPolicies: $resource('/delegate/services/api/customer-documents/policies/:accountId/:agencyCodes', {
				accountId: '@accountId',
				agencyCodes: '@agencyCodes'
			}, serviceConfigObject),
			getAccountDocumentMetadata: $resource('/delegate/services/api/customer-documents/metadata/:accountId/:docTypes', {
				accountId: '@accountId',
				docTypes: '@docTypes'
			}, serviceConfigObject),
			getPolicyTermDocumentMetadata: $resource('/delegate/services/api/customer-documents/metadata/:accountId/:policyId/:term/:docTypes', {
				accountId: '@accountId',
				policyId: '@policyId',
				term: '@term',
				docTypes: '@docTypes'
			}, serviceConfigObject),
			getAgentMetadata: $resource('/delegate/services/api/agency-documents/metadata/:agencyCodes/:docTypes', {
				agencyCodes: '@agencyCodes',
				docTypes: '@docTypes'
			}, serviceConfigObject)
		};
	}

})();

// agentDocuments.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('agentDocuments', agentDocuments)
        //Declare the document constants
        .constant('DOC_TYPE_AGENT_LOSS', 'ALOSS');

    agentDocuments.$inject = ['$stateParams', '$location', 'documentData', '_'];

    function agentDocuments($stateParams, $location, documentData, _) {
        return {
            getMetadataFulfilled: function(params, fulfillment) {
                documentData.getAgentMetadata.get(params).$promise.then(function(response) {
                    fulfillment(response);
                });
            },
            getAgentMetadata: function(vm) {
                var that = this;
                //Check that routeParams exist then process
                if ($stateParams.agencyCodes && $stateParams.agencyCodes.length > 0) {
                    this.getMetadataFulfilled({
                            agencyCodes: vm.agencyCodes,
                            docTypes: vm.docTypes
                        },
                        function(response) {
                            if (response.succeeded && response.data && response.data.length > 0) {
                                vm.documentsMetadata = response.data;
                                that.processAgentMetadataList(vm);
                                that.sortMetaDataList(vm);
                                vm.contentLoaded = true;
                            } else if (response.succeeded && response.data && response.data.length === 0) {
                                var agencyCodesArray = vm.agencyCodes.split(',');
                                var aMessage = null;
                                if (agencyCodesArray.length > 1)
                                    aMessage = "We are currently unable to find documents for location codes " + vm.agencyCodes + ".";
                                else
                                    aMessage = "We are currently unable to find documents for location code " + vm.agencyCodes + ".";

                                vm.message = {
                                    type: 'warning',
                                    msg: aMessage
                                };
                                vm.contentLoaded = true;
                            } else {
                                vm.message = {
                                    type: 'error',
                                    msg: response.message
                                };
                                vm.contentLoaded = true;
                            }
                        });
                }
                //Else default to a error message
                else {
                    vm.message = {
                        type: 'error',
                        msg: "We are currently unable to find any documents."
                    };
                    vm.contentLoaded = true;
                }
            },
            /**
             * Method will append the customerName to a documentsMetadata list
             * -NOTE: this is done for display reasons
             */
            processAgentMetadataList: function(vm) {
				for (var i = 0; i < vm.documentsMetadata.length; i++) {
					var aDoc = vm.documentsMetadata[i];
					var agencyCode = aDoc["agencyCode"]; 
					var aLocation = _.where(vm.agencyLocations, {locationCode: agencyCode})[0];
					aDoc['customerName'] = aLocation.locationName;					
				}
            },
            /**
             * Helper Method that sorts by key agencyCode
             */
            sortMetaDataList: function(vm) {
                vm.documentsMetadata = _.sortBy(vm.documentsMetadata, function(item) {
                    return [item.agencyCode];
                });
            }
        };
    }
})();

// accountAlerts.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('accountAlerts', accountAlerts)
		.constant('MAX_ALERTS', 5);

	accountAlerts.$inject = ['MAX_ALERTS', '$localStorage'];

    function accountAlerts(MAX_ALERTS, $localStorage) {
        return {
			process: function(newCustomers, pendingRenewal, pendingCancellation, today){
				today = today || new Date();
				var foundToday = this.searchDates(today.toLocaleDateString(), this.getAlerts());
				var allEmpty = (!newCustomers.length && !pendingRenewal.length && !pendingCancellation.length);
				// only add if there's no entry for today and all notifications are not empty
				if(!foundToday && !allEmpty){
					this.addAlert(today, newCustomers, pendingRenewal, pendingCancellation);
				}
				this.trimAlerts(today);
			},

			searchDates: function (dateString, alertsArray, returnType){
				returnType = returnType || 'boolean';
				var result = ((returnType === 'boolean') ? false : {});
				for (var i=0; i < alertsArray.length; i++) {
					var alert = alertsArray[i];
					// we're using the native String method localeCompare()
					// for the comparison since IE and PhantomJS has problems
					// with comparing dates with alert.date === dateString
					// localeCompare() returns 0 for a match and not boolean
					if (alert.date.localeCompare(dateString) === 0) {
						result = ((returnType === 'boolean') ? true : alert);
						break;
					}
				}
				return result;
			},

			getAlerts: function(){
				// create empty array if not defined
				if (!$localStorage.alerts){
					$localStorage.$default({
						alerts: []
					});
				}
				// return sorted alerts
				return $localStorage.alerts.sort(function(a,b){
					return new Date(a.date) - Date(b.date);
				});
			},

			getAlertsFiltered: function(){
				return this.getAlerts().filter(function(value){
					if(value.ngShow === true){
						return value;
					}
				});
			},

			getAlertsNewCustomersToday: function(today){
				today = today || new Date();
				var result = [];
				var todaysAlert = this.searchDates(today.toLocaleDateString(), this.getAlertsFiltered(), 'object');
				if(todaysAlert.accounts){
					for (var i=0; i < todaysAlert.accounts.length; i++) {
						var account = todaysAlert.accounts[i];
						if (account.type === 'new') {
							result = account.accounts;
							break;
						}
					}
				}
				return result;
			},

			addAlert: function(today, newCustomers, pendingRenewal, pendingCancellation){
				var alert = {
					date: today.toLocaleDateString(),
					time: today.toLocaleTimeString(),
					guid: this.createGuid(),
					ngShow: true,
					accounts: []
				};
				if(newCustomers.length){
					var newCustomersAlert = {
						type: 'new',
						accounts: newCustomers
					};
					alert.accounts.push(newCustomersAlert);
				}
				if(pendingRenewal.length){
					var pendingRenewalAlert = {
						type: 'renewal',
						accounts: pendingRenewal
					};
					alert.accounts.push(pendingRenewalAlert);
				}
				if(pendingCancellation.length){
					var pendingCancellationAlert = {
						type: 'cancellation',
						accounts: pendingCancellation
					};
					alert.accounts.push(pendingCancellationAlert);
				}
				$localStorage.alerts.unshift(alert);
			},

			trimAlerts: function(today){
				// trim alerts set as hidden whose date is not today
				for(var x = 0; x < $localStorage.alerts.length; x++){
					var alert = $localStorage.alerts[x];
					if(alert.ngShow === false && alert.date !== today.toLocaleDateString()){
						$localStorage.alerts.splice(x, 1);
					}
				}
				// trim alerts over max alerts allowed
				if ($localStorage.alerts.length > MAX_ALERTS){
					var trimTotal = $localStorage.alerts.length - MAX_ALERTS;
					for(var i = 0; i < trimTotal; i++){
						$localStorage.alerts.pop();
					}
				}
			},

			hideAlert: function(index){
				$localStorage.alerts[index].ngShow = false;
			},

			dismissAll: function(){
				$localStorage.alerts.length = 0;
			},

			createGuid: function(){
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				});
			}
        };
    }
})();

// accountData.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('accountData', accountData);

	accountData.$inject = ['$resource', 'serviceConfigObject'];

	function accountData($resource, serviceConfigObject) {
		return {
			account: $resource('/delegate/services/api/myaccount', {}, serviceConfigObject),
			policy: $resource('/delegate/services/api/myaccount', {}, serviceConfigObject),
			certificates: $resource('/delegate/services/api/certificates/:policyNumber/:policyPeriodId', {
				certificateId: '@certificateId'
			}, serviceConfigObject),
			policies: $resource('/delegate/services/api/policies?:param=:query', {
				param: '@param',
				query: '@query'
			}, serviceConfigObject),
		};
	}
})();

// agentData.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentData', agentData);

	agentData.$inject = ['$resource', 'serviceConfigObject'];

	function agentData($resource, serviceConfigObject) {
		var bussedData = {};

		var setBussedData = function(data) {
			bussedData = data;
		};

		var getBussedData = function() {
			return bussedData;
		};

		return {
			getLocations: $resource('/delegate/services/api/my-account-agent/agent/', {}, serviceConfigObject),
			getAgentCustomers: $resource('/delegate/services/api/my-account-agent/accounts/:agencyCodes', {}, serviceConfigObject),
			getAgentCustomerPolicies: $resource('/delegate/services/api/my-account-agent/policies/:accountId/:agencyCodes', {
				accountId: '@accountId',
				agencyCodes: '@agencyCodes'
			}, serviceConfigObject),
			paymentdue: $resource('/delegate/services/api/payments/paymentdue/account/:accountId', {}, serviceConfigObject),
			adminpaymentdue: $resource('/delegate/services/api/payments/adminpaymentdue?gwaccountnumber=:gwaccountnumber', {
				gwaccountnumber: '@gwaccountnumber'
			}, serviceConfigObject),
			premiumreport: $resource('/delegate/services/api/:accountId/premiumreport/:policyNumber', {
				accountId: '@accountId',
				policyNumber: '@policyNumber'
			}, serviceConfigObject),
			setBussedData: setBussedData,
			getBussedData: getBussedData,
			getCertificates: $resource('/delegate/services/api/:accountId/certificates/:policyNumber/:policyPeriodId', {
				accountId: '@accountId',
				policyNumber: '@policyNumber',
				policyPeriodId: '@policyPeriodId'
			}, serviceConfigObject),
			getCCPaymentFormInfo: $resource('/delegate/services/api/my-account-agent/payments/creditcard/TPS/:accountId', {
				accountId: '@accountId'
			}, serviceConfigObject),		
		    makeACHpaymentAgent: $resource('/delegate/services/api/payments/agentmakepayment', {}, serviceConfigObject),
		    makeACHpaymentAdmin: $resource('/delegate/services/api/payments/adminmakepayment', {}, serviceConfigObject)
		};
	}

})();

// agentCustomers.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('agentCustomers', agentCustomers);

    agentCustomers.$inject = ['$stateParams', 'agentData', 'accountAlerts'];

    function agentCustomers($stateParams, agentData, accountAlerts) {
        var dataArray = null;
        var accountFilterObj = {};

        return {
            getAgentCustomersPromise: function(agencyCodeCommaDelimitedList) {
                return agentData.getAgentCustomers.get({
                    agencyCodes: agencyCodeCommaDelimitedList
                }).$promise;
            },

            getAgentCustomersList: function(vm) {
                //
                // If dataArray exists use it
                //
                if (dataArray) {
                    vm.contentLoaded = true;
                    vm.agentCustomerArray = dataArray;
                    vm.alerts = accountAlerts.getAlertsFiltered();
                    return;
                }
                //
                // If dataArray does not exist go out and fetch the data
                //
                var agencyCodes = $stateParams.agencyCodes;
                // for omni use locationCode from route
                if (agencyCodes) {
                    var that = this;
                    that.getAgentCustomersPromise(agencyCodes).then(function(response) {
                            //response = {"succeeded":true,"data":{"allCustomers":[{"customerID":"5000054321","customerName":"Sample Inc","policyInfo":[{"policyNumber":"1054321","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054322","customerName":"Sample LLC","policyInfo":[{"policyNumber":"1054322","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054323","customerName":"Sample Org","policyInfo":[{"policyNumber":"1054323","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false}],"newCustomers":["5000101","5000102"],"pendingRenewalCustomers":["5000103","5000104"],"pendingCancellationCustomers":["5000105","5000106"],"renewalPeriod":0},"message":"","cached":false};
                            //response = {"succeeded":true,"data":{"allCustomers":[{"customerID":"5000054321","customerName":"Sample Inc","policyInfo":[{"policyNumber":"1054321","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054322","customerName":"Sample LLC","policyInfo":[{"policyNumber":"1054322","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false},{"customerID":"5000054323","customerName":"Sample Org","policyInfo":[{"policyNumber":"1054323","policyType":"GW","ownerID":null,"status":null,"powerSuitePolicyNumber":null,"policyPeriods":[{"policyPeriodId":"pcprod:30002","term":null,"status":"Scheduled","parentPolicyId":null,"effectiveDate":"2016-02-01T00:00:00","expirationDate":"2017-02-01T00:00:00","insuranceCompany":null,"liabilityType":null,"address":null,"namedInsureds":null,"classCodes":null,"agencyCode":"101-004-0002","waivers":[],"statusDisplay":"Scheduled"}],"userPermissions":null,"agencyCode":null,"statusDisplay":"N/A"}],"status":"Scheduled","daysTilExpiration":0,"newAccount":false}],"newCustomers":[],"pendingRenewalCustomers":[],"pendingCancellationCustomers":[],"renewalPeriod":0},"message":"","cached":false};
                            if (response.succeeded) {
                                accountAlerts.process(
                                    response.data.newCustomers,
                                    response.data.pendingRenewalCustomers,
                                    response.data.pendingCancellationCustomers
                                );
                                vm.alerts = accountAlerts.getAlertsFiltered();
                                var newCustomersToday = accountAlerts.getAlertsNewCustomersToday();
                                if (newCustomersToday.length) {
                                    // run process to update response.data.allCustomers with newCustomersToday
                                    // before it is sent to that.setDataArray() and set to vm.agentCustomerArray
                                }
                                that.setDataArray(response.data.allCustomers);
                                vm.agentCustomerArray = response.data.allCustomers;
                            } else {
                                vm.message = {
                                    type: 'error',
                                    msg: response.message
                                };
                            }
                            vm.contentLoaded = true;
                        })
                        .catch(function(error) {
                            vm.message = {
                                type: 'error',
                                msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                            };
                            vm.contentLoaded = true;
                        });
                } else {
                    vm.message = {
                        type: 'error',
                        msg: "Unable to find location codes."
                    };
                    vm.contentLoaded = true;
                }
            },
            setDataArray: function(aArray) {
                dataArray = aArray;
            },
            getDataArray: function() {
                return dataArray;
            },
            setAccountFilterObj: function(obj) {
                accountFilterObj = obj;
            },
            getAccountFilterObj: function() {
                return accountFilterObj;
            }
        };
    }
})();

// agentCustomerPolicies.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentCustomerPolicies', agentCustomerPolicies);

	agentCustomerPolicies.$inject = ['agentData'];

	function agentCustomerPolicies(agentData) {
		return {
			getAgentCustomerPolicies: function(params) {
				return agentData.getAgentCustomerPolicies.get(params).$promise;
			},
			account: function(vm) {
				var that = this;
				this.getAgentCustomerPolicies({
					accountId: vm.accountId,
					agencyCodes: vm.agencyCodes
				}).then(function (data) {
					if (data.succeeded && data.data.policies.length > 0) {
						vm.postLoadDataAction(data.data);
						that.setContentLoaded(vm);
					}
					else if (data.succeeded && data.data.policies.length === 0) {
						vm.message = {
							type: 'error',
							msg: "We are currently unable to access policies for account " + vm.accountId + ".  Please contact us at 1.800.231.1363 so that we can assist."
						};
						that.setContentLoaded(vm);
					}
					else {
						vm.message = {
							type: 'error',
							msg: data.message
						};
						that.setContentLoaded(vm);
					}
				})
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
					that.setContentLoaded(vm);
                });
			},
			certsClaims: function(vm) {
				var that = this;
				this.getAgentCustomerPolicies({
					accountId: vm.accountId,
					agencyCodes: vm.agencyCodes
				}).then(function(data) {
					if (data.succeeded) {
						vm.applyPolicyPerms(data.data);
						if(vm.certPerms) {vm.applyCertificatePerms(data.data);}
						that.setContentLoaded(vm);
					}
					else {
						vm.message = {
							type: 'error',
							msg: data.message
						};
						that.setContentLoaded(vm);
					}
				})
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
					that.setContentLoaded(vm);
                });
			},
			setContentLoaded: function(vm) {
				if(!vm.disableContentLoader){
					vm.contentLoaded = true;
				}
			}
		};
	}
})();

// agentAccountDocumentMetadata.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentAccountDocumentMetadata', agentAccountDocumentMetadata);

	agentAccountDocumentMetadata.$inject = ['documentData'];

	function agentAccountDocumentMetadata(documentData) {
		return {
			getAgentAccountDocumentMetadata: function(params, fulfillment) {
				documentData.getAccountDocumentMetadata.get(params).$promise.then(function (data) {
					fulfillment(data);
				});
			},
			getMetadata: function(vm) {
				this.getAgentAccountDocumentMetadata({
					accountId: vm.accountId,
					docTypes: vm.accountDocTypes
				},
				function(data) {
					if(data.succeeded) {
						vm.accountDocumentMetadata = data.data;
						vm.contentLoaded = true;
					}
					else {
						vm.message = {
							type: 'error',
							msg: data.message
						};
						vm.contentLoaded = true;
					}
				});
			}
		};
	}
})();

// agentCustomerDocumentAccounts.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentCustomerDocumentAccounts', agentCustomerDocumentAccounts);

	agentCustomerDocumentAccounts.$inject = ['documentData'];

	function agentCustomerDocumentAccounts(documentData) {
		return {
			getAgentCustomerDocumentAccounts: function(params, fulfillment) {
				documentData.getAgentAccounts.get(params).$promise.then(function (data) {
					fulfillment(data);
				});
			},
			landing: function(vm) {
				if (vm.agencyCodes) {
					this.getAgentCustomerDocumentAccounts({
						agencyCodes: vm.agencyCodes
					},
					function(data) {
						if (data.succeeded) {
							vm.agentCustomers = data.data;
							vm.contentLoaded = true;
						} else {
							vm.message = {
								type: 'error',
								msg: data.message
							};
							vm.contentLoaded = true;
						}
					});
				} else {
					vm.message = {
						type: 'error',
						msg: "Unable to find location code."
					};
					vm.contentLoaded = true;
				}
			}
		};
	}
})();

// agentCustomerDocumentPolicies.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentCustomerDocumentPolicies', agentCustomerDocumentPolicies);

	agentCustomerDocumentPolicies.$inject = ['$q', 'documentData'];

	function agentCustomerDocumentPolicies($q, documentData) {
		return {
			getAgentCustomerDocumentPolicies: function(params) {
				return documentData.getAccountPolicies.get(params).$promise;
			},
			getPoliciesAndPeriods: function(vm) {
				return this.getAgentCustomerDocumentPolicies({
					accountId: vm.accountId,
					agencyCodes: vm.agencyCodes
				}).then(function(data) {
					var deferred = $q.defer();
					if(data.succeeded) {
						try{
							vm.customerName = data.data.guidewireAccount.accountName;
							vm.policies = data.data.policies;
							vm.selectedPolicy = vm.policies[0];
							vm.policyId = vm.selectedPolicy.policyNumber;
							vm.periods = vm.selectedPolicy.policyPeriods;
							vm.selectedPeriod = vm.periods[0];
							vm.term = vm.selectedPeriod.term;
							deferred.resolve(vm);
						}
						catch(e){
							vm.message = {
								type: 'error',
								msg: e
							};
							vm.policyDocumentLoaded = true;
							deferred.reject(vm);
						}
						return deferred.promise;
					}
					else {
						vm.message = {
							type: 'error',
							msg: data.message
						};
						vm.policyDocumentLoaded = true;
						deferred.reject(vm);
						return deferred.promise;
					}
				})
			}
		};
	}
})();

// agentPolicyTermDocumentMetadata.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('agentPolicyTermDocumentMetadata', agentPolicyTermDocumentMetadata);

	agentPolicyTermDocumentMetadata.$inject = ['documentData'];

	function agentPolicyTermDocumentMetadata(documentData) {
		return {
			getAgentPolicyTermDocumentMetadata: function(params) {
				return documentData.getPolicyTermDocumentMetadata.get(params).$promise;
			},
			getMetadata: function(vm) {
				var that = this;
				vm.policyDocumentLoaded = false;
				this.getAgentPolicyTermDocumentMetadata({
					accountId: vm.accountId,
					policyId: vm.policyId,
					term: vm.term,
					docTypes: vm.policyDocTypes
				}).then(function(data) {
					if(data.succeeded) {
						vm.policyDocumentMetadata = that.sortDocArray(data.data, 'name');
					}
					else {
						vm.message = {
							type: 'error',
							msg: data.message
						};
					}
					vm.policyDocumentLoaded = true;
				})
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.policyDocumentLoaded = true;
                });
			},
			sortDocArray: function(docArray, sortBy) {
				return docArray.sort(function(a, b) {
					var x = a[sortBy]; var y = b[sortBy];
					return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				});
			}
		};
	}
})();

// flashMessage.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('flashMessage', flashMessage);

    flashMessage.$inject = ['$rootScope'];


    function flashMessage($rootScope) {
        var queue = [],
            currentMessage = {};

        $rootScope.$on('$stateChangeSuccess', function() {
            if (queue.length > 0)
                currentMessage = queue.shift();
            else
                currentMessage = {};
        });

        return {
            set: function(message) {
                var msg = message;
                queue.push(msg);

            },
            get: function(message) {
                return currentMessage;
            },
            pop: function(message) {
                switch (message.type) {
                    case 'success':
                        toastr.success(message.body, message.title);
                        break;
                    case 'info':
                        toastr.info(message.body, message.title);
                        break;
                    case 'warning':
                        toastr.warning(message.body, message.title);
                        break;
                    case 'error':
                        toastr.error(message.body, message.title);
                        break;
                }
            }
        };
    }
})();

// historyData.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.services')
		.factory('historyData', historyData);

	historyData.$inject = ['$resource', 'serviceConfigObject'];

	function historyData($resource, serviceConfigObject) {
		return {
			chargesHistory: $resource('/delegate/services/api/charges/account/accountid/:accountId', {
				accountId: '@accountId'
			}, serviceConfigObject),
			paymentsHistory: $resource('/delegate/services/api/payments/account/accountid/:accountId', {
				accountId: '@accountId'
			}, serviceConfigObject)
		};
	}
})();

// creditCard.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('creditCardService', creditCardService);

    creditCardService.$inject = ['$stateParams', 'agentData'];

    function creditCardService($stateParams, agentData) {
        return {
            getCCPaymentFormInfoPromise: function(vm) {
                return agentData.getCCPaymentFormInfo.get({accountId: vm.accountId}).$promise;
            },
            getIFrameURL: function(vm) {
                var that = this;
                try {
                    this.getCCPaymentFormInfoPromise(vm).then(function(response) {
                        if (response.succeeded) {
                            vm.paymentFormResponse = response;
                            vm.paymentFormData = response.data;
                            that.buildBluePayURL(vm);
                            vm.contentLoaded = true;
                        } else {
                            vm.paymentFormData = null;
                            vm.paymentFormResponse = response;
                            vm.message = {
                                type: 'error',
                                msg: response.message
                            };
                            vm.contentLoaded = true;
                        }
                    });
                } catch (e) {
                    //console.error(e);
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.contentLoaded = true;
                }
            },
            buildBluePayURL: function(vm) {
                var bluePayHost = "https://secure.bluepay.com/interfaces/shpf?";
                var argsArray = [];
                //
                // bp10emu API
                //
                argsArray.push("MERCHANT=" + vm.paymentFormData.merchant);
                argsArray.push("DBA=" + vm.paymentFormData.dba);
                argsArray.push("TRANSACTION_TYPE=" + vm.paymentFormData.transaction_type);
                argsArray.push("MODE=" + vm.paymentFormData.mode);
                argsArray.push("TAMPER_PROOF_SEAL=" + vm.paymentFormData.tps_key);
                argsArray.push("TPS_DEF=" + vm.paymentFormData.tps_def);
                argsArray.push("RESPONSEVERSION=" + vm.paymentFormData.responseVersion);
                //
                // SHPF API
                //
                argsArray.push("SHPF_FORM_ID=" + vm.paymentFormData.shpf_form_id);
                argsArray.push("SHPF_ACCOUNT_ID=" + vm.paymentFormData.shpf_account_id);
                argsArray.push("SHPF_TPS=" + vm.paymentFormData.shpf_key);
                argsArray.push("SHPF_TPS_DEF=" + vm.paymentFormData.shpf_tps_def);
                //
                // CPMI API
                //
                var amount = parseFloat(Math.round(vm.paymentdue.amountDue * 100) / 100).toFixed(2);
                if (vm.paymentdue.amountDue > 0)
                	argsArray.push("AMOUNT=" + amount);
                else
                	argsArray.push("AMOUNT=" + '');

                argsArray.push("EMAIL=" + vm.paymentFormData.emailAddress);
                argsArray.push("NAME1=" + vm.paymentFormData.fName);
                argsArray.push("NAME2=" + vm.paymentFormData.lName);
                argsArray.push("CUSTOM_ID=" + vm.paymentFormData.custom_id1);
                argsArray.push("ORDER_ID=" + vm.paymentFormData.accountNumber);
                argsArray.push("APPROVED_URL=" + vm.paymentFormData.approved_url);
                argsArray.push("DECLINED_URL=" + vm.paymentFormData.declined_url);
                argsArray.push("MISSING_URL=" + vm.paymentFormData.missing_url);

                var appendArgs = argsArray.join('&');
                var encodedURI = encodeURI(appendArgs);

                vm.bluePayURL = bluePayHost + encodedURI;
                return vm.bluePayURL;
            },
            setCreditCardMessage: function(vm) {
                if (!vm.result) {
                    return;
                } else if (vm.result.toUpperCase() === "APPROVED") {
                    vm.flash.set({
                        body: "Payment successful! An email containing the details of your payment has been sent to the email address tied to your account. Your $" + vm.amount + " payment reference number is " + vm.transId + ".",
                        type: "success"
                    });
                } else if (vm.result.toUpperCase() === "DECLINED") {
                    vm.flash.set({
                        body: "Payment was declined. Please verify your payment information was entered correctly.",
                        type: "warning"
                    });
                } else {
                    vm.flash.set({
                        body: "Payment was unsuccessful. Please contact CopperPoint Mutual at 800.231.1363.",
                        type: "error"
                    });
                }
            }
        };
    }
})();

// payment.ach.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('paymentACHService', paymentACHService);

    paymentACHService.$inject = ['$stateParams', 'agentData', 'flashMessage', '$location'];

    function paymentACHService($stateParams, agentData, flashMessage, $location) {
        return {
            makeACHpaymentPromise: function(vm) {
                if (vm.isCSRorOMNI) {
                    return agentData.makeACHpaymentAdmin.save(vm.paymentData).$promise;
                }
                return agentData.makeACHpaymentAgent.save(vm.paymentData).$promise;
            },

            getPaymentDataObj: function(vm) {
                var paymentDataObj = {
                    "amount": (vm.amount * 1),
                    "description": null,
                    "paymentDate": null,
                    "paymentDestination": "Account",
                    "paymentMethod": vm.paymentMethod,
                    "accountType": vm.accountType,
                    "bankAccountNumber": vm.bankAccountNumber,
                    "routingNumber": vm.routingNumber,
                    "accountNumber": vm.selectedPolicy.ownerID
                };                
                vm.paymentData = paymentDataObj;
                return vm.paymentData;
            },
            makeACHpayment: function(vm) {
                var that = this;
                try {
                    that.getPaymentDataObj(vm);

                    that.makeACHpaymentPromise(vm).then(function(response) {
                        if (response.succeeded) {
                            vm.makePaymentResponse = response;
                            vm.makePaymentData = response.data;

                            flashMessage.set({body: 'Payment successful! An email containing the details of your payment has been sent to the email address tied to your account. Your payment reference number is '+vm.makePaymentData.paymentId+'.', type: "success"});
                            $location.path('/customer-policy-service/'+vm.agencyCodes+'/'+vm.accountId+'/billing/'+$stateParams.policyNumber);
                        } else {
                        	flashMessage.set({title: "Error!", body: 'There was a problem in submitting your payment. Please contact us at 1.800.231.1363 so that we can assist.', type: "error"});
                            $location.path('/customer-policy-service/'+vm.agencyCodes+'/'+vm.accountId+'/billing/'+$stateParams.policyNumber);
                        }
                    });
                } catch (e) {
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem in submitting your payment. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.contentLoaded = true;
                }
            }
        };
    }
})();

// locations.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('locations', locations);

    locations.$inject = ['$stateParams', '$location', 'agentData', '_'];

    function locations($stateParams, $location, agentData, _) {
        return {
            getLocationsPromise: function() {
                return agentData.getLocations.get().$promise;
            },
            getAgencyInfoList: function(vm) {
                this.getLocationsPromise().then(function(response) {
                    if (response.succeeded) {
                        vm.agencyInfoList = response.data;
                    } else {
                    	vm.agencyInfoList = null;
                    }
                })
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.contentLoaded = true;
                });
            },
            landing: function(vm) {
            	this.getLocationsPromise().then(function(response) {
                    if (response.succeeded) {
                        vm.agentCustomers = response.data;
                        vm.contentLoaded = true;
                    } else {
                        vm.message = response.message;
                        vm.contentLoaded = true;
                    }
                })
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.contentLoaded = true;
                });
            },
            getLocationsThenCallback: function(vm) {
                var that = this;
                if ($stateParams.agencyCodes && $stateParams.agencyCodes.length > 0) {
                    vm.agencyCodes = $stateParams.agencyCodes;
                    vm.locationsCallbackAction();
                    that.setContentLoadedTrueIfNotDisabled(vm);
                } else {
                	this.getLocationsPromise().then(function(response) {
                        if (response.succeeded && response.data.length > 0) {
                            vm.agencyLocations = response.data;
							vm.agencyCodes = that.convertAgencyLocationsToString(vm.agencyLocations);
							$stateParams.agencyCodes = vm.agencyCodes;
							vm.locationsCallbackAction();
                            $location.path(vm.path + vm.agencyCodes);
                            that.setContentLoadedTrueIfNotDisabled(vm);
                        } else if (response.succeeded && response.data.length === 0) {
							vm.message = {
                                type: 'info',
                                msg: "There was a problem finding your location information. Please contact us at 1.800.231.1363 so that we can assist."
                            };
                            vm.contentLoaded = true;
                        } else {
							vm.message = {
                                type: 'error',
                                msg: response.message
                            };
                            vm.contentLoaded = true;
                        }
                    })
                    .catch(function(error){
                        vm.message = {
                            type: 'error',
                            msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                        };
                        vm.contentLoaded = true;
                    });
                }
            },
            convertAgencyLocationsToString: function(locations) {
                if (locations && locations.length > 0) {
                    var list = _.pluck(locations, 'locationCode');
                    return list.join(",");
                }
                return "";
            },
            /**
             * Helper method will check if contentLoaded flag is disabled for this service
             */
            setContentLoadedTrueIfNotDisabled: function(vm) {
                //If contentLoader is not disabled
                if (!vm.disableContentLoader)
                    vm.contentLoaded = true;
            }
        };
    }
})();

// underscore.service.js
(function(_) {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('_', underscore);



    function underscore() {
        return _;
    }

})(_);

// perms.service.js
(function(MODEL) {
	'use strict';

	/**
	 * Perms Service that aids in determineing the perms of user based on policy and user.
	 * Utilizing Role object
	 **/
	angular
		.module('agentApp.services')
		.factory('permsService', permsService);


	function permsService() {
		//Role Object
		var role = null;

		/**
		 * Update the perms object with the policy
		 **/
		var updatePermissions = function(policy) {
			if (role === undefined || role === null)
				role = new MODEL.Role(policy);

			role.perm.certsView = this.permForPolicy(policy, 'CERTS_VIEW');
			role.perm.certsCreate = this.permForPolicy(policy, 'CERTS_CREATE');
			role.perm.certsDelete = this.permForPolicy(policy, 'CERTS_DELETE');
			role.perm.certsSave = this.permForPolicy(policy, 'CERTS_SAVE');
			role.perm.certsView = this.permForPolicy(policy, 'CERTS_VIEW');
			role.perm.claimView = this.permForPolicy(policy, 'VIEW_CLAIMS');
			role.perm.claimSubmit = this.permForPolicy(policy, 'SUBMIT_CLAIMS');
			role.perm.billView = this.permForPolicy(policy, 'VIEW_BILLING');
			role.perm.billReport = this.permForPolicy(policy, 'REPORT_BILLING');
			role.perm.billPayCC = this.permForPolicy(policy, 'PAY_BILLING_CC');
			role.perm.billPayACH = this.permForPolicy(policy, 'PAY_BILLING_ACH');
			role.perm.viewCustomerAccountDelegation = this.permForPolicy(policy, 'USER_MGMT'); //customer delegation
			role.perm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
			//
			// Agent Perms
			//
			role.perm.isAgentUser = isAgentUser();
			role.perm.viewAgentAccountDelegation = viewAgentAccountDelegation();//agent delegation
			role.perm.viewAgentDocumentAccount = viewAgentDocumentAccount();//agent document account
			role.perm.viewAgentDocumentPublic = viewAgentDocumentPublic();//agent document public
			role.perm.viewAgentDocumentPrivate = viewAgentDocumentPrivate();//agent document private
			//
			// Debug the perms
			//
			//console.log(role.permToString());
			//console.log(role.policyToString());
			return role;
		};


		return {
			updatePermissions: updatePermissions,

			permForIndexZeroPolicy: function(policies, key) {
				if (policies && (policies.length > 0) && policies[0]) {
					var policy = policies[0];
					return this.permForPolicy(policy, key);
				}
				return false; //default
			},
			permForPolicy: function(policy, key) {
				var userPermissionsMap = this.userPermsMapForPolicy(policy);
				if (userPermissionsMap) {
						var value = userPermissionsMap[key];
						//console.log('policy# = '+ policy.policyNumber+',	'+ key+'='+ value);
						return value !== null ? value : false;
				}
					return false; //default
			},
			userPermsMapForPolicy: function(policy) {
				if (policy && (policy.userPermissions)) {
						var userPermissionModel = policy.userPermissions;
						if (userPermissionModel) {
							var userPermissionsMap = userPermissionModel.userPermissions;
							return userPermissionsMap;
						}
					}
					return null; //default
			}
		};
	}
})(MODEL);
// scrollTo.service.js
/**
 * Service will automatically scroll the window to the top if menu is not visible 
 */
(function() {
    'use strict';

    angular
        .module('agentApp.services')
        .factory('scrollToService', scrollToService);

    scrollToService.$inject = ['$rootScope', '$window'];


    function scrollToService($rootScope, $window) {
        var rect = null;

        $rootScope.$on('$stateChangeSuccess', function() {
            var element = document.getElementById('menuBarContainerId');      
    		rect = element.getBoundingClientRect();
    	    var isElementNotViewable = rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
	    	var clientWidth = document.documentElement.clientWidth;
	    	//matches @media (max-width: 768px)
	    	var isBrowserInSmallMobileMode =  clientWidth >= 768;
    	    if (!isElementNotViewable && isBrowserInSmallMobileMode) {
    	    	//console.log("isElementNotViewable="+isElementNotViewable);
    	    	//console.log("clientWidth="+clientWidth);
    	    	var x = rect.left;
    	    	var y = rect.top;
    	    	//console.log("x: "+rect.left+" y: "+rect.top);
    	    	//scroll to the menuBar
    			$window.scrollTo(0, 0);
    	    }
   		 	
        });

        return {
        	//empty
        };
    }
})();

// menuBar.module.js
(function() {
    'use strict';

    angular.module('agentApp.menuBarModule', []);

})();

// menuBar.controller.js
(function() {
	'use strict';

	angular
		.module('agentApp.menuBarModule')
		.controller('MenuBarCtrl', MenuBarCtrl);

	MenuBarCtrl.$inject = ['$scope', '$location', '$stateParams', '$state', '$timeout', 'scrollToService'];

	function MenuBarCtrl($scope, $location, $stateParams, $state, $timeout, scrollToService) {
		var mc = this;
		// wait after angular digest cycle to read $stateParams.pastFirstClick
		$timeout(function(){
			mc.pastFirstClick = (angular.isDefined($stateParams.pastFirstClick) ? true : false);
		}, 0, false);
		mc.oneAtATime = true;
		mc.viewAgentAccountDelegation = viewAgentAccountDelegation();
		mc.viewAgentDocumentAccount = viewAgentDocumentAccount();//agent document account
		mc.viewAgentDocumentPublic = viewAgentDocumentPublic();//agent document public
		mc.viewAgentDocumentPrivate = viewAgentDocumentPrivate();//agent document private
        mc.showAccountServiceLink = viewAccountService() || editAccountService() || newAccountService() || submitPolicyAccountService();
        /**
         * Method that will load a status object with the status of paths and nested buttons
         */
        mc.updateStatusObj = function() {
    		mc.status = {
				isFirstOpen: $location.$$absUrl.search('/agency-')>-1,
				isSecondOpen: $location.$$absUrl.search('/customer-')>-1,

				isPolicyServiceHighlighted: $location.$$absUrl.search('customer-policy-service')>-1,
				isDocumentsHighlighted: $location.$$absUrl.search('customer-documents')>-1,
				isAccountServiceHighlighted: $location.$$absUrl.search('customer-account-service')>-1,
				absURL: $location.$$absUrl
    		};
        };

		// When the controller loads initialize the status object
        mc.updateStatusObj();

        /**
         * Method watches the abs URL. If the location changes them update the statusObj
         */
		$scope.$watch(function() {return $location.$$absUrl;}, function(newVal, oldVal){
	        mc.updateStatusObj();

	        // check for root of url then default to secondOpen
	        if($location.$$url === '/') {
	        	mc.status.isSecondOpen = true;
	        }
	    });

		mc.reloadState = function(){
			// if we're past the first click, force reload of state
			if(mc.pastFirstClick){
				$state.go($state.current, {}, {reload: true});
			}
			// if we're on the first click, set pastFirstClick to true
			if(!mc.pastFirstClick){
				mc.pastFirstClick = true;
			}
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// landing.module.js
(function() {
    'use strict';

    angular.module('agentApp.landingModule', []);

})();

// landing.controller.js
(function() {
	'use strict';

	angular
		.module('agentApp.landingModule')
		.controller('LandingCtrlAs', LandingCtrlAs);

	LandingCtrlAs.$inject = ['$location', 'locations', 'agentCustomers', 'accountAlerts'];

	function LandingCtrlAs($location, locations, agentCustomers, accountAlerts) {
		// initialize
		var vm = this;
		vm.contentLoaded = false;
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		/*
		Alerts are populated in agentCustomers.getAgentCustomersList() by
		accountAlerts.getAlertsFiltered() after accountAlerts.process() runs.
		This file needs to be refactored to directly use promises similar to
		how agentCustomerDocumentPolicies.getPoliciesAndPeriods() works
		inside of documents-summary.controllers.js
		*/
		vm.alerts = [];

		/**
		 * Method will first agencyLocations data then it will getAgentCustomers based on agencyCodes
		 */
		vm.getAgencyInfoAction = function() {
			vm.path = '/';
			locations.getLocationsThenCallback(vm);
		};

		/**
		 * Method will fetch the getAgentCustomers data
		 */
		vm.locationsCallbackAction = function() {
			agentCustomers.getAgentCustomersList(vm);
		};

		vm.showAllAlerts = function() {
			// the angular way is to use $document but it doesn't have getElementById()
			// alternatively you can build a directive but a directive is longer than two lines
			document.getElementById('account-alerts').style.maxHeight = 'none';
			document.getElementById('show-all').disabled = true;
		};

		vm.dismissAlert = function(index, guid) {
			accountAlerts.hideAlert(index);
			document.getElementById(guid).style.display = 'none';
		};

		vm.dismissAll = function() {
			accountAlerts.dismissAll();
			document.getElementById('account-alerts-section').style.display = 'none';
		};

		vm.navToPolicyService = function(accounts, agencyCodes, type, date, time) {
			var obj = {
				type: type,
				accounts: accounts,
				date: date,
				time: time
			};
			agentCustomers.setAccountFilterObj(obj);
			$location.path('/customer-policy-service/' + agencyCodes);
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// agency-documents.module.js
(function() {
    'use strict';

    angular.module('agentApp.agencyDocumentsModule', []);

})();

// agency-documents.controller.js
(function() {
    'use strict';

    angular
        .module('agentApp.agencyDocumentsModule')
        .controller('AgencyDocumentsCtrlAs', AgencyDocumentsCtrlAs);

    AgencyDocumentsCtrlAs.$inject = ['locations', 'agentDocuments', 'DOC_TYPE_AGENT_LOSS'];

    function AgencyDocumentsCtrlAs(locations, agentDocuments, DOC_TYPE_AGENT_LOSS) {
        // initialize
        var vm = this;
        vm.contentLoaded = false;
        vm.isAgentUser = isAgentUser();
        vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();

        /**
         * Method will use the location service to get agencyCodes then do a callback to locationsCallbackAction
         */
        vm.loadDataAction = function() {
            vm.path = '/agency-documents/';
            vm.docTypes = DOC_TYPE_AGENT_LOSS;
            vm.disableContentLoader = true;
            locations.getLocationsThenCallback(vm);
        };

        vm.locationsCallbackAction = function() {
        	locations.getLocationsPromise().then(function(response) {
				if (response.succeeded) {
					vm.agencyLocations = response.data;
					agentDocuments.getAgentMetadata(vm);
				} else {
					vm.message = {
						type: 'error',
						msg: response.message
					};
					vm.contentLoaded = true;
				}
			})
            .catch(function(error){
                vm.message = {
                    type: 'error',
                    msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                };
                vm.contentLoaded = true;
            });
        };


        //Liferay Extend session
        extendSessionWithAP();
    }
})();

// customer-documents.module.js
(function() {
    'use strict';

    angular.module('agentApp.customerDocumentsModule', []);

})();
// documents-landing-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.customerDocumentsModule')
        .factory('documentsLandingConfig', documentsLandingConfig);

    function documentsLandingConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    colReorder: true,
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
        			"aaSorting": [
        				[1, "desc"]
        			],
        			"oLanguage": {
        				"sSearch": "Search:",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
        			}
        		};
            },

            getColumnDefs: function($stateParams){
                return [{
        			"aTargets": [0],
        			"sTitle": "Account#",
        			"mDataProp": "customerID",
        			"mRender": function(data, type, full) {
        				if (data !== null) {
        					return "<a href='#/customer-documents/" + $stateParams.agencyCodes + "/" + full.customerID + "'>" + data + "</a>";
        				} else {
        					return "Account not found.";
        				}
        			},
        		}, {
        			"aTargets": [1],
        			"sTitle": "Customer Name",
        			"mDataProp": "customerName"
        		}, {
        			"aTargets": [2],
        			"sTitle": "Policy Numbers",
        			"mDataProp": "policyInfo",
        			"bVisible": true,
        			"mRender": function(data, type, full) {
        				if (data && data.length > 0) {
        					var list = _.pluck(data, 'policyNumber');
        					return list.join(", ");
        				} else {
        					return "No polices found";
        				}
        			}
        		}];
            }
        };
    }
})();

// documents-landing.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.customerDocumentsModule')
		.controller('CustomerDocumentsLandingCtrlAs', CustomerDocumentsLandingCtrlAs);

	CustomerDocumentsLandingCtrlAs.$inject = ['$location', '$stateParams', 'locations', 'agentCustomerDocumentAccounts', '_', 'flashMessage', 'documentsLandingConfig'];

	function CustomerDocumentsLandingCtrlAs($location, $stateParams, locations, agentCustomerDocumentAccounts, _, flashMessage, documentsLandingConfig) {
		// initialize
		var vm = this;
		vm.contentLoaded = false;
		vm.flash = flashMessage;
		vm.agentCustomers = [];
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		vm.overrideOptions = documentsLandingConfig.getOverrideOptions();
		vm.columnDefs = documentsLandingConfig.getColumnDefs($stateParams);

		vm.loadDataAction = function() {
			vm.path = '/customer-documents/';
			vm.disableContentLoader = true;
			locations.getLocationsThenCallback(vm);
		};

		vm.locationsCallbackAction = function() {
			agentCustomerDocumentAccounts.landing(vm);
		};

		extendSessionWithAP();
	}
})();

// documents-summary.controllers.js
(function() {
	'use strict';

	/* PARPT is Final Audit Advice and Payroll Advice */

	angular
		.module('agentApp.customerDocumentsModule')
		.controller('CustomerDocumentsSummaryCtrlAs', CustomerDocumentsSummaryCtrlAs)
		.constant('ACCOUNTDOCTYPES', 'PLOSS')
		.constant('POLICYDOCTYPES', 'PPAKT,PCPAKT,PARPT') 
		.filter("asDate", function () {
			return function (input) {
				var dateTime = input.split(' ');
				var dateArr = dateTime[0].split('-');
				var timeArr = dateTime[1].split(':');
				var dateObj = new Date(dateArr[0], dateArr[1]-1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
				return dateObj;
			};
		});

	CustomerDocumentsSummaryCtrlAs.$inject = ['ACCOUNTDOCTYPES', 'POLICYDOCTYPES', '$stateParams', 'agentCustomerDocumentPolicies', 'agentAccountDocumentMetadata', 'agentPolicyTermDocumentMetadata', 'flashMessage'];

	function CustomerDocumentsSummaryCtrlAs(ACCOUNTDOCTYPES, POLICYDOCTYPES, $stateParams, agentCustomerDocumentPolicies, agentAccountDocumentMetadata, agentPolicyTermDocumentMetadata, flashMessage) {
		// initialize
		var vm = this;
		vm.contentLoaded = false;
		vm.flash = flashMessage;
		vm.agencyCodes = $stateParams.agencyCodes;
		vm.accountId = $stateParams.accountId;
		vm.accountDocTypes = ACCOUNTDOCTYPES;
		vm.policyDocTypes = POLICYDOCTYPES;
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();

		vm.getPolicyTermData = function(vm){
			// load policy doc metadata
			// requires selected accountId, policyId and term
			agentPolicyTermDocumentMetadata.getMetadata(vm);
		};

		vm.updatePolicyAndPeriod = function(){
			vm.policyId = vm.selectedPolicy.policyNumber;
			vm.periods = vm.selectedPolicy.policyPeriods;
			vm.selectedPeriod = vm.periods[0];
			vm.term = vm.selectedPeriod.term;
			vm.getPolicyTermData(vm);
		};

		// load account doc metadata
		agentAccountDocumentMetadata.getMetadata(vm);

		// populate policies and periods dropdown
		agentCustomerDocumentPolicies.getPoliciesAndPeriods(vm)
			.then(function(vm) {
				// load policy doc metadata
				vm.getPolicyTermData(vm);
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// customer-policy-service.module.js
(function() {
    'use strict';

    angular.module('agentApp.customerPolicyServiceModule', []);

})();
// customer-policy-service-config.service.js
(function() {
	'use strict';

	angular
		.module('agentApp.customerPolicyServiceModule')
		.factory('policyServiceConfig', policyServiceConfig);

	function policyServiceConfig() {
		return {
			getOverrideOptions: function(vm) {
				return {
					stateSave: true,
					stateDuration: 2419200,
					/* 1 month */
					dom: 'Bfrtip',
					colReorder: true,
					buttons: [
                        "colvis",                        
						// custom button
						{
							className: "dtCustomButton",
							text: '<i class="icon-filter icon-1x"></i>',
							action: function(e, dt, node, config) {
								vm.toggleAdvancedFilters();
								return "";
							}
						}
					],
					"aaSorting": [
						[2, "desc"]
					],
					"oLanguage": {
						"sSearch": "Search:",
						buttons: {
							colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
						}
					}
				};
			},

			getColumnDefs: function($stateParams) {
				return [{
					"aTargets": [0],
					"sTitle": "Account#",
					"mDataProp": "customerID",
					"mRender": function(data, type, full) {
						if (data !== null) {
							return "<a href='#/customer-policy-service/" + $stateParams.agencyCodes + "/" + full.customerID + "/account'>" + data + "</a>";
						} else {
							return "Account not found.";
						}
					}
				}, {
					"aTargets": [1],
					"sTitle": "Customer Name",
					"mDataProp": "customerName"
				}, {
					"aTargets": [2],
					"sTitle": "Policy Numbers",
					"mDataProp": "policyInfo",
					"mRender": function(data, type, full) {
						if (data && data.length > 0) {
							var list = _.pluck(data, 'policyNumber');
							return list.join(", ");
						} else {
							return "No polices found";
						}
					}
				}, {
					"aTargets": [3],
					"sTitle": "Status",
					"mDataProp": "status",
					"mRender": function(data, type, full) {
						return getStatusLabel (data);
					}
				}, {
					"aTargets": [4],
					"sTitle": "Days to Expiration",
					"mDataProp": "daysTilExpiration",
					"bVisible": false,
                    "sClass":"hidden"
				}, {
					"aTargets": [5],
					"sTitle": "New Account",
					"mDataProp": "newAccount",
					"bVisible": false,
                    "sClass":"hidden"
				}

				];
			},

			searchOrColumnDefs: function() {
				return {
					columnIndexes: [0, 3],
					dataMapKeys: ["accountFilter", "statusFilter"]
				};
			},

			searchRangeColumnDefs: function() {
				return {
					columnIndexes: [4],
					dataMapKeys: ["daysTilExpiration"]
				};
			}
		};
	}
})();

// customer-policy-service.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.customerPolicyServiceModule')
		.controller('CustomerPolicyServiceCtrlAs', CustomerPolicyServiceCtrlAs);

	CustomerPolicyServiceCtrlAs.$inject = ['$scope', '$location', '$stateParams', 'locations', 'agentCustomers', '_', 'flashMessage', 'policyServiceConfig'];

	function CustomerPolicyServiceCtrlAs($scope, $location, $stateParams, locations, agentCustomers, _, flashMessage, policyServiceConfig) {
		// initialize
		var vm = this;
		vm.contentLoaded = false;
		vm.flash = flashMessage;
		vm.agentCustomerArray = [];
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		vm.overrideOptions = policyServiceConfig.getOverrideOptions(vm);
		vm.columnDefs = policyServiceConfig.getColumnDefs($stateParams);
		vm.searchOrColumnDefs = policyServiceConfig.searchOrColumnDefs();
		vm.searchRangeColumnDefs = policyServiceConfig.searchRangeColumnDefs();
		vm.showAdvancedFilters = false;
		//object used to store any RANGE search data
		vm.searchRangeData = {
			"daysTilExpiration": {
				"min": null,
				"max": null
			}
		};
		//object used to store any OR search data
		vm.searchORData = {
			"accountFilter": null,
			"statusFilter": null
		};
		
		
		/**
		 * Method will first agencyLocations data then it will getAgentCustomers based on agencyCodes
		 */
		vm.loadDataAction = function() {
			vm.path = '/customer-policy-service/';
			vm.disableContentLoader = true;
			locations.getLocationsThenCallback(vm);
		};

		/**
		 * Method will fetch the getAgentCustomers data
		 */
		vm.locationsCallbackAction = function() {
			agentCustomers.getAgentCustomersList(vm);

			if (agentCustomers.getAccountFilterObj() && agentCustomers.getAccountFilterObj().accounts) {
				vm.searchORData.accountFilter = agentCustomers.getAccountFilterObj().accounts;
				vm.alert = {};
				vm.alert.type = agentCustomers.getAccountFilterObj().type;
				vm.alert.date = agentCustomers.getAccountFilterObj().date;
				vm.alert.time = agentCustomers.getAccountFilterObj().time;
			}
		};

		vm.toggleAdvancedFilters = function() {
			vm.showAdvancedFilters = !vm.showAdvancedFilters;

			if (vm.showAdvancedFilters) {
				vm.searchRangeData.daysTilExpiration.min = 0;
				vm.searchRangeData.daysTilExpiration.max = 120;
				vm.searchORData.statusFilter = [];
				vm.checkModel = {};
			} else {
				vm.searchRangeData.daysTilExpiration.min = null;
				vm.searchRangeData.daysTilExpiration.max = null;
				vm.searchORData.statusFilter = null;
				vm.checkModel = {};
			}

			$scope.$apply();
		};

		/**
		* Method will clear the account filters from data tables
		*/
		vm.clearAccountFilterMessagePanel = function() {
			//set service global variable to null
			agentCustomers.setAccountFilterObj(null);
			//set controller local variable to null
			vm.searchORData.accountFilter = null;
		};

		/**
		 * Watcher that monitors checkModel and pushes the values into the vm.searchORData.statusFilter
		 */
		$scope.$watchCollection('vm.checkModel', function () {
		    vm.searchORData.statusFilter = [];
		    angular.forEach(vm.checkModel, function (value, key) {
		      if (value) {
		    	  key = capitalizeFirstLetter(key);
		    	  vm.searchORData.statusFilter.push(key);
		      }
		    });
		});
		
		/**
		 * TODO: This method is a HACK for jQuery datatables v1.10. I really dont want to do this but there 
		 * is no other option at this time!!!!!!!! As of v1.10 the conlvis API does not allow a for an 
		 * easy implementation to hide hidden column buttons via our Angular directive.
		 */
		$scope.$on('$stateChangeSuccess', function() {
			$("div.dt-buttons a.buttons-colvis").click(function(e) {
			   var links = $("div.dt-button-collection a");
			   for (var i = 0; i < links.length; i++) {
				   var link = links[i];
				   
				   if (link && link.firstChild && link.parentNode) {
					   var innerSpanElement = link.firstChild;
					   var innerText = innerSpanElement.innerText;
					   
					   if (innerText && (innerText === "Days to Expiration" || innerText === "New Account")) {
						   //link.style.visibility = "hidden";
						   var parentElement = link.parentNode;
						   parentElement.removeChild(link);
					   }
				   }
			   }
			});
		});
		

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			
			alert("your going to page="+toState.name);
//			if (toState.name !== 'login' && !UsersService.getCurrentUser()) {
//				event.preventDefault();
//				$state.go('login');
//			}
		});
		
		
		// Liferay Extend session
		extendSessionWithAP();
	}
})();

// customer-account-service.module.js
(function() {
    'use strict';

    angular.module('agentApp.customerAccountServiceModule', []);

})();

// customer-account-service.controller.js
(function() {
    'use strict';

    angular
        .module('agentApp.customerAccountServiceModule')
        .controller('CustomerAccountServiceCtrlAs', CustomerAccountServiceCtrlAs);

    CustomerAccountServiceCtrlAs.$inject = [];

    function CustomerAccountServiceCtrlAs() {
        // initialize
        var vm = this;
        vm.contentLoaded = false;
        vm.isAgentUser = isAgentUser();
        vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();

        /**
         * Method will ......	
         */
        vm.loadDataAction = function() {
        	vm.contentLoaded = true;
        };


        //Liferay Extend session
        extendSessionWithAP();
    }
})();

// account-management-search.controller.js
(function() {
    'use strict';

    angular
        .module('agentApp.customerAccountServiceModule')
        .controller('AccountManagementSearchCtrlAs', AccountManagementSearchCtrlAs);

    AccountManagementSearchCtrlAs.$inject = ['$scope', '$sce', 'AGENCY_PORTAL_BASE_URL'];

    function AccountManagementSearchCtrlAs($scope, $sce, AGENCY_PORTAL_BASE_URL) {
        // initialize
        var vm = this;
        vm.contentLoaded = false;
        vm.isAgentUser = isAgentUser();
        vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
        
        vm.untrustedURL = AGENCY_PORTAL_BASE_URL+"/AgencyPortal";
        vm.url = $sce.trustAsResourceUrl(vm.untrustedURL);

        /**
         * Method will ......	
         */
        vm.loadDataAction = function() {
        	vm.contentLoaded = false;
        };
        
        /**
         * Method is callback after the IFrame has loaded content.
         */
        vm.onIFrameLoadCallback = function() {
        	vm.contentLoaded = true;
        	$scope.$apply(); //used because iFrame directive uses $timeout 
        };
    }
})();

// account-management-new.controller.js
(function() {
    'use strict';

    angular
        .module('agentApp.customerAccountServiceModule')
        .controller('AccountManagementNewCtrlAs', AccountManagementNewCtrlAs);

    AccountManagementNewCtrlAs.$inject = ['$scope', '$sce', 'AGENCY_PORTAL_BASE_URL'];

    function AccountManagementNewCtrlAs($scope, $sce, AGENCY_PORTAL_BASE_URL) {
        // initialize
        var vm = this;
        vm.contentLoaded = false;
        vm.isAgentUser = isAgentUser();
        vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
        
        vm.untrustedURL = AGENCY_PORTAL_BASE_URL+"/AgencyPortal?tab=newacct";
        vm.url = $sce.trustAsResourceUrl(vm.untrustedURL);
        
        
        /**
         * Method will ......	
         */
        vm.loadDataAction = function() {
        	vm.contentLoaded = false;
        };
        
        /**
         * Method is callback after the IFrame has loaded content.
         */
        vm.onIFrameLoadCallback = function() {
        	vm.contentLoaded = true;
        	$scope.$apply(); //used because iFrame directive uses $timeout 
        };
        
    }
})();

// account.module.js
(function() {
    'use strict';

    angular.module('agentApp.accountModule', []);

})();
// account-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.accountModule')
        .factory('accountConfig', accountConfig);

    function accountConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    colReorder: true,
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
        			"aaSorting": [
                        [ 0, "desc" ]
                    ],
        			"oLanguage": {
        				"sSearch": "Search:",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
        			}
        		};
            },

            getColumnDefs: function($scope){
                return [
        			{
        			"aTargets": [0],	// Column number which needs to be modified
        			"mData": "policyNumber",
                    "sTitle": "Policy Number",
        			"mRender": function ( data, type, full ) {
        				return '<a href="#/customer-policy-service/'+$scope.agencyCodes+'/'+$scope.accountId+'/account/policies/'+data+'">'+data+'</a>';
        			}
        		},
        		{
        			"aTargets": [1],	// Column number which needs to be modified
        			"mData": "status",
                    "sTitle": "Status",
        			"mRender": function ( data, type, full ) {
        				return getStatusLabel(data);
        			}
        		},
        		{
        			"aTargets": [2],	// Column number which needs to be modified
        			"mData": "policyPeriods",
                    "sTitle": "Policy Periods",
        			"mRender": function ( data, type, full ) {
        				var returnValue="<p style='display: inline'>";
        				var policyPeriods= [];
        				for (var i = 0; i < data.length; i++) {

        					var eff = data[i].effectiveDate;
        					var exp = data[i].expirationDate;
        					//NOTE: The span tags are used by custom sort 'policyPeriod_expDate' to identify expirationDate
        					policyPeriods.push("<span id='effectiveDate"+i+"'>"+parseDate(eff) + "</span>" + ' - ' + "<span id='expirationDate"+i+"'>" +parseDate(exp)+"</span>");
        				}
        				return returnValue.concat(policyPeriods.join(', '),"</p>");
        			},
        			"sType": 'policyPeriod_expDate' //Use custom sort on this column. Sort is named 'policyPeriod_expDate'
        		},{
        			"aTargets": [3],	// Column number which needs to be modified
        			"mData": "agencyCode",
                    "sTitle": "Producer",
        			"sType": "html",
        			"mRender": function ( data, type, full ) {
        				return data.replace(/-/g, '&#45;');
        			}
        		}
        		];
            }
        };
    }
})();

// account.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.accountModule')
		.controller('AccountCtrl', AccountCtrl);

	AccountCtrl.$inject = ['$scope', '$location', '$stateParams', 'logger', 'agentCustomerPolicies', 'permsService', 'flashMessage', 'accountConfig'];

	function AccountCtrl($scope, $location, $stateParams, logger, agentCustomerPolicies, permsService, flashMessage, accountConfig) {
		// initialize
		$scope.contentLoaded = false;
		$scope.isAgentUser = isAgentUser();//variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();//variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.columnDefs = accountConfig.getColumnDefs($scope);
		$scope.overrideOptions = accountConfig.getOverrideOptions();

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			agentCustomerPolicies.account($scope);
		};

		$scope.postLoadDataAction = function(data) {
			$scope.policies = data.policies;
			$scope.customerName = data.guidewireAccount.accountName;

			//Permissions based on policy selection
			$scope.zeroIndexPolicy = $scope.policies[0];
			$scope.role = permsService.updatePermissions($scope.zeroIndexPolicy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// policy.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.accountModule')
		.controller('PolicyCtrl', PolicyCtrl);


	PolicyCtrl.$inject = ['$scope', '$location', '$stateParams', '$sce', 'logger', '_', 'agentCustomerPolicies', 'agentData', 'permsService', 'flashMessage'];

	function PolicyCtrl($scope, $location, $stateParams, $sce, logger, _, agentCustomerPolicies, agentData, permsService, flashMessage) {
		// initialize
		$scope.isAgentUser = isAgentUser();//variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();//variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.policyNumber = $stateParams.policyNumber;

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			agentCustomerPolicies.account($scope);
		};

		$scope.postLoadDataAction = function(data) {
			$scope.customerName = data.guidewireAccount.accountName;
			$scope.policies = data.policies;
			$scope.selectedPolicy = _.where($scope.policies, {policyNumber: $stateParams.policyNumber})[0];
			$scope.agencyCode = $scope.selectedPolicy.agencyCode;
			$scope.policyPeriod = $scope.selectedPolicy.policyPeriods[0];

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions($scope.selectedPolicy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};
		};

		$scope.showWaiverModal = function() {
			var showExtraText = false;

			if($scope.selectedPolicy !== null) {
				var effectiveDate = new Date(parseDate($scope.policyPeriod.effectiveDate));
				var targetDate = new Date('01/01/2015');
				if($scope.selectedPolicy.policyType && $scope.selectedPolicy.policyType === 'PS'){
					showExtraText = false;
				}
				if(effectiveDate >= targetDate && $scope.selectedPolicy.policyType && $scope.selectedPolicy.policyType === 'GW'){
					showExtraText = true;
				}

			}

			$scope.feeAdvisoryText = showExtraText;
			$('#waiverModal').modal('show');
		};
		
		$scope.getStatusLabelDisplay = function(policyStatus) {
			var statusHTML = getStatusLabel (policyStatus);
			return $sce.trustAsHtml(statusHTML);
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// claims.module.js
(function() {
    'use strict';

    angular.module('agentApp.claimsModule', []);

})();
// claims.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.claimsModule')
		.controller('ClaimsCtrl', ClaimsCtrl);

	ClaimsCtrl.$inject = ['$scope', '$stateParams', 'permsService', 'agentData'];

	function ClaimsCtrl($scope, $stateParams, permsService, agentData) {

		var vm = this;
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		vm.accountId = $stateParams.accountId;
		$scope.accountId = $stateParams.accountId;
		vm.agencyCodes = $stateParams.agencyCodes;
		vm.contentLoaded = false;


		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		vm.loadDataAction = function() {
			var policiesResult = agentData.getAgentCustomerPolicies.get({accountId: vm.accountId, agencyCodes: vm.agencyCodes});
			policiesResult.$promise.then(function(data) {
				if(data.succeeded) {
					vm.applyPolicyPerms(data.data);
					vm.contentLoaded = true;
				}
				else {
					vm.message = { type: 'error', msg: data.message };
					vm.contentLoaded = true;
				}
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});
		};


		vm.applyPolicyPerms = function(data){
			vm.customerName = data.guidewireAccount.accountName;
			var policy = data.policies[0];

			//Permissions based on policy selection
			vm.role = permsService.updatePermissions(policy);

			vm.menu = {
				accountName: vm.customerName,
				agencyCodes: vm.agencyCodes,
				accountId: vm.accountId,
				role: vm.role
			};
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// billing.module.js
(function() {
    'use strict';

    angular.module('agentApp.billingModule', []);

})();
// billing.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('BillingCtrl', BillingCtrl);

	BillingCtrl.$inject = ['$scope', '$location', '$stateParams', 'agentCustomerPolicies', 'paymentDueService', 'historyService', 'billingConfig', 'creditConfig', 'permsService', 'flashMessage', 'creditCardService'];

	function BillingCtrl($scope, $location, $stateParams, agentCustomerPolicies, paymentDueService, historyService, billingConfig, creditConfig, permsService, flashMessage, creditCardService) {
		// initialize
		$scope.inlineContentLoaded = false;
		$scope.paymentDueLoaded = false;
		$scope.isAgentUser = isAgentUser();//variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();//variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.result = $stateParams.result;
		$scope.transId = $stateParams.transId;
		$scope.amount = $stateParams.amount;
		// get configs for billing and credit tables
		$scope.billingOverrideOptions = billingConfig.getOverrideOptions();
		$scope.billingColumnDefs = billingConfig.getColumnDefs();
		$scope.creditOverrideOptions = creditConfig.getOverrideOptions();
		$scope.creditColumnDefs = creditConfig.getColumnDefs();

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			agentCustomerPolicies.account($scope);
		};

		$scope.setLoaded = function($scope) {
			$scope.paymentDueLoaded = true;
		};

		$scope.postLoadDataAction = function(data) {
			$scope.policies = data.policies;
			$scope.customerName = data.guidewireAccount.accountName;
			$scope.selectedPolicy = $scope.policies[0];
			$scope.policyNumber = $scope.selectedPolicy.policyNumber;
			if($stateParams.result){
				creditCardService.setCreditCardMessage($scope);
				$location.path('/customer-policy-service/'+$scope.agencyCodes+'/'+$scope.accountId+'/billing/');
			}

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions($scope.selectedPolicy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				policyNumber: $scope.policyNumber,
				role: $scope.role
			};

			paymentDueService.getPayment($scope, $scope.setLoaded);
			$scope.showTable('chargesHistory');
		};

		$scope.showTable = function(table) {
			if(table === 'chargesHistory'){
				$scope.inlineContentLoaded = false;
				historyService.getChargesHistory($scope)
					.then(function($scope) {
						// show/hide tables
						$scope.showChargesHistory = true;
						$scope.showPaymentsHistory = false;
    					$scope.inlineContentLoaded = true;
					})
					.catch(function($scope){
						$scope.message = {
							type: 'error',
							msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
						};
						$scope.inlineContentLoaded = true;
					});
			}
			else{
				$scope.inlineContentLoaded = false;
				historyService.getPaymentsHistory($scope)
					.then(function($scope) {
						// show/hide tables
						$scope.showChargesHistory = false;
						$scope.showPaymentsHistory = true;
    					$scope.inlineContentLoaded = true;
					})
					.catch(function($scope){
						$scope.message = {
							type: 'error',
							msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
						};
						$scope.inlineContentLoaded = true;
					});
			}
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// pick-payment-option.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('PickPaymentOptionCtrl', PickPaymentOptionCtrl);

	PickPaymentOptionCtrl.$inject = ['$location', '$scope', '$state', '$stateParams', 'flashMessage', 'agentCustomerPolicies', 'permsService'];

	function PickPaymentOptionCtrl($location, $scope, $state, $stateParams, flashMessage, agentCustomerPolicies, permsService) {
		// initialize
		var vm = this;
		vm.paymentDueLoaded = false;
		vm.contentLoaded = false;
		vm.flash = flashMessage;
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		vm.isOMNIAdmin = isOMNIAdmin();
		vm.accountId = $stateParams.accountId;
		vm.agencyCodes = $stateParams.agencyCodes;
		vm.policyNumber = $stateParams.policyNumber;
		//NOTE: I don't like this but because ui-breadcrumbs expects global scope variables
		$scope.accountId = vm.accountId;
		$scope.agencyCodes = vm.agencyCodes;
		$scope.policyNumber = vm.policyNumber;

		/**
		 * Method will load the data
		 */
		vm.loadDataAction = function() {
			//we dont have a policyNumber disable spinner on/off indicators
			if (!vm.policyNumber) {
				vm.disableContentLoader = true;
			}
			agentCustomerPolicies.account(vm);
		};

		vm.postLoadDataAction = function(data) {
			vm.policies = data.policies;
			vm.customerName = data.guidewireAccount.accountName;
			if(vm.policyNumber){
				vm.selectedPolicy = _.where(vm.policies, {policyNumber: vm.policyNumber})[0];
			}
			else{
				//undefined policyNumber redirect
				vm.selectedPolicy = vm.policies[0];
				$location.path('/customer-policy-service/' + vm.agencyCodes + '/' + vm.accountId + '/billing/make-payment/' + vm.selectedPolicy.policyNumber);
			}

			//Permissions based on policy selection
			vm.role = permsService.updatePermissions(vm.selectedPolicy);
			if (!vm.role.perm.billPayCC && !vm.role.perm.billPayACH) {
				$state.go('/');
			}

			vm.paymentMethod = (vm.billPayCC && !vm.billPayACH) ? "WEB_CC" : "WEB_ACHEFT";

			vm.menu = {
				accountName: vm.customerName,
				agencyCodes: vm.agencyCodes,
				accountId: vm.accountId,
				policyNumber: vm.policyNumber,
				role: vm.role
			};
			vm.contentLoaded = true;
		};


		//Liferay Extend session
		extendSession();
	}
})();

// make-ach-payment.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('MakeACHPaymentCtrl', MakeACHPaymentCtrl);

	MakeACHPaymentCtrl.$inject = ['$modal', '$scope', '$location', '$sce', '$stateParams', '_', 'flashMessage', 'agentCustomerPolicies', 'agentData', 'permsService', 'paymentACHService', 'paymentDueService'];

	function MakeACHPaymentCtrl($modal, $scope, $location, $sce, $stateParams, _, flashMessage, agentCustomerPolicies, agentData, permsService, paymentACHService, paymentDueService) {
		// initialize
		$scope.contentLoaded = false;
		$scope.isAgentUser = isAgentUser();//variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();//variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.policyNumber = $stateParams.policyNumber;
		$scope.showConfirmationPanel = false;

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			$scope.disableContentLoader = true;
			agentCustomerPolicies.account($scope);
		};

		$scope.getPaymentCB = function($scope) {
			$scope.postPaymentDueAction();
			$scope.contentLoaded = true;
		};

		$scope.postLoadDataAction = function(data) {
			$scope.policies = data.policies;
			$scope.customerName = data.guidewireAccount.accountName;

			if ($stateParams.policyNumber) {
				$scope.selectedPolicy = _.where($scope.policies, {
					policyNumber: $scope.policyNumber
				})[0];
			} else {
				$scope.selectedPolicy = $scope.policies[0];
				$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/billing/make-payment/' + $scope.selectedPolicy.policyNumber);
			}

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions($scope.selectedPolicy);

			//Reroute back to myAccount if
			if (!$scope.role.perm.billPayACH)
				$location.path('/customer-policy-service/account/' + $scope.accountId + '/');

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				policyNumber: $scope.policyNumber,
				role: $scope.role
			};

			paymentDueService.getPayment($scope, $scope.getPaymentCB);

		};

		/**
		 * Method will process after getPaymentsDue servcie is called
		 */
		$scope.postPaymentDueAction = function() {
			$scope.paymentMethod = "WEBACHEFT";
			$scope.otherAmount = '';

			if($scope.paymentdue.amountDue !== 0) {
				$scope.amount = $scope.paymentdue.amountDue;
			} else {
				$scope.amount = null;
			}

			$scope.$watch('otherAmount', function(){
				if($scope.otherAmount > 0) {
					$scope.otherAmount = Math.round($scope.otherAmount * 100) / 100;
					$scope.amount = $scope.otherAmount;
				} else {
					$scope.otherAmount = '';
				}
			});
		};

		$scope.toggleConfirmationPanel = function() {
			paymentACHService.getPaymentDataObj($scope);
			$scope.showConfirmationPanel = !$scope.showConfirmationPanel;
		};

		$scope.makeACHpayment = function() {
			//show busy indicator in parent and then call payment service
			$scope.vm.contentLoaded = false;
			paymentACHService.makeACHpayment($scope);
		};
		/**
		 * Method used to declare a modal object with options and then the modal callback.
		 * Note: I am not doing nothing with the callback method but noted it for reference.
		 */
        $scope.openTermsAndConditions = function(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/agent-portlet/app/featureSets/billing/make-ach-terms-modal.html',
                controller: 'ModalTermsAndConditionsCtrl',
                size: size, //'sm', 'lg', or empty
                resolve: {
                    parentVM: function() {
                        return $scope;
                    }
                }
            });

            modalInstance.result.then(function(callBackObj) {
            	//do nothing just close the modal panel
            });
        };

		//Liferay Extend session
		extendSessionWithAP();
	}

})();

// make-ach-terms-modal.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('MakeACHTermsModalCtrl', MakeACHTermsModalCtrl);

	MakeACHTermsModalCtrl.$inject = ['$modalInstance', '$scope', 'parentVM'];

	function MakeACHTermsModalCtrl($modalInstance, $scope, parentVM) {
        $scope.ok = function() {
        	parentVM.termsAgeementClicked = true;
        	parentVM.terms = true;
            $modalInstance.close(null);
        };

        $scope.cancel = function() {
        	parentVM.termsAgeementClicked = true;
        	parentVM.terms = false;
            $modalInstance.dismiss('cancel');
        };
        
		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// make-cc-payment.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('MakeCreditCardPaymentCtrl', MakeCreditCardPaymentCtrl);

	MakeCreditCardPaymentCtrl.$inject = ['$scope', '$state', '$stateParams', 'paymentDueService', 'creditCardService', '$sce', 'flashMessage'];

	function MakeCreditCardPaymentCtrl($scope, $state, $stateParams, paymentDueService, creditCardService, $sce, flashMessage) {
		// initialize
		var vm = this;
		vm.contentLoaded = false;
		vm.flash = flashMessage;
		vm.isAgentUser = isAgentUser();
		vm.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		vm.isCSRUser = isCSRUser();
		vm.isOMNIAdmin = isOMNIAdmin();
		vm.accountId = $stateParams.accountId;
		vm.agencyCodes = $stateParams.agencyCodes;
		vm.policyNumber = $stateParams.policyNumber;
		//NOTE: I don't like this but because ui-breadcrumbs expects global scope variables
		$scope.accountId = vm.accountId;
		$scope.agencyCodes = vm.agencyCodes;
		$scope.policyNumber = vm.policyNumber;


		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		vm.loadDataAction = function() {
			//redirect back to root path
			if (!vm.policyNumber || !vm.agencyCodes || !vm.accountId || vm.isCSRUser) {
				$state.go('/');
			}

			paymentDueService.getPayment(vm, vm.postLoadDataAction);
		};

		vm.postLoadDataAction = function(vm) {
			creditCardService.getIFrameURL(vm);
		};

        /**
         * Method is callback after the IFrame has loaded content.
         */
//        vm.onIFrameLoadCallback = function() {
//        	vm.contentLoaded = true;
//        	$scope.$apply(); //used because iFrame directive uses $timeout
//        };

		vm.bluePaySecureURL = function() {
			vm.trusteURL = $sce.trustAsResourceUrl(vm.bluePayURL);
			return vm.trusteURL;
		};

		//Liferay Extend session
		extendSession();
	}
})();

// payment-due.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.billingModule')
        .factory('paymentDueService', paymentDueService);

    paymentDueService.$inject = ['agentData'];

    function paymentDueService(agentData) {
        return {
            getPaymentDue: function(vm, params) {
    			if(vm.isCSRorOMNI) {
    				return agentData.adminpaymentdue.get(params).$promise;
    			} else {
    				return agentData.paymentdue.get(params).$promise;
    			}
            },
            getPayment: function(vm, cb) {
	            cb = cb || function(){};
                var params;
    			if(vm.isCSRorOMNI) {
    				params = {gwaccountnumber: vm.selectedPolicy.ownerID};
    			} else {
    				params = {accountId: vm.accountId};
    			}
                this.getPaymentDue(vm, params)
                    .then(function(response) {
                        if(response.succeeded && response.data && (Object.keys(response.data).length > 0)) {
                            vm.paymentdue = response.data;
    					} else {
                            vm.message = {
    							type: 'error',
    							msg: "There was a problem in paying your bill. Please contact us at 1.800.231.1363 so that we can assist."
    						};
    					}
                        cb(vm);
                    })
                    .catch(function(error){
                        vm.message = {
    						type: 'error',
    						msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
    					};
    					vm.paymentDueLoaded = true;
                        cb(vm);
                    });
            }
        };
    }
})();

// report-premium-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.billingModule')
        .factory('reportPremiumConfig', reportPremiumConfig);

    function reportPremiumConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
        			"oLanguage": {
        				"sSearch": "Search:",
        				"sEmptyTable": "No premium reports available at this time.",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
        			}
        		};
            },

            getColumnDefs: function($scope){
                return [{
        			"aTargets": [0],
        			"sTitle": "Reporting Period",
        			"mData": "reportPeriodStartDate",
        			"mRender": function(data, type, full) {
        				if (full && full.reportPeriodStartDate && full.reportPeriodEndDate) {
        					return parseDate(full.reportPeriodStartDate) + ' - ' + parseDate(full.reportPeriodEndDate);
        				} else return "";
        			}
        		}, {
        			"aTargets": [1],
        			"sTitle": "Status",
        			"mData": "reportingStatus",
        			"mRender": function(data, type, full) {
        				if (data) {
        					return data;
        				} else return "";
        			}
        		}, {
        			"aTargets": [2],
        			"sTitle": "Due By",
        			"mData": "reportPeriodDueDate",
        			"mRender": function(data, type, row) {
        				var reportingStatus = row.reportingStatus;
        				if (reportingStatus && reportingStatus === 'In Progress')
        					return '<a href="#/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/billing/report-premium/submit-report/' + $scope.policyNumber + '/' + data + '">' + parseDate(data) + '</a>';
        				else
        					return parseDate(data);
        			}
        		}, {
        			"aTargets": [3],
        			"sTitle": "Completed On",
        			"mData": "reportCompletionDate",
        			"mRender": function ( data, type, row ) {
        				var reportingStatus = row.reportingStatus;	
        				if (reportingStatus && reportingStatus === 'Completed')
        					return parseDate(data);
        				else
        					return '';
        			}
        		}];
            }
        };
    }
})();

// report-premium.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('ReportPremiumCtrl', ReportPremiumCtrl);

	ReportPremiumCtrl.$inject = ['$scope', '$location', '$sce', '$stateParams', '_', 'agentCustomerPolicies', 'agentData', 'permsService', 'flashMessage', 'reportPremiumConfig'];

	function ReportPremiumCtrl($scope, $location, $sce, $stateParams, _, agentCustomerPolicies, agentData, permsService, flashMessage, reportPremiumConfig) {
		// initialize
		$scope.paymentData = agentData.getBussedData();
		$scope.contentLoaded = false;
		$scope.isAgentUser = isAgentUser(); //variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin(); //variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.policyNumber = $stateParams.policyNumber;
		$scope.columnDefs = reportPremiumConfig.getColumnDefs($scope);
		$scope.overrideOptions = reportPremiumConfig.getOverrideOptions();

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			$scope.disableContentLoader = true;
			agentCustomerPolicies.account($scope);
		};

		$scope.postLoadDataAction = function(data) {
			$scope.policies = data.policies;
			$scope.customerName = data.guidewireAccount.accountName;

			$scope.selectedPolicy = _.where($scope.policies, {
				policyNumber: $stateParams.policyNumber
			})[0];

			if ($stateParams.policyNumber) {
				$scope.selectedPolicy = _.where($scope.policies, {
					policyNumber: $scope.policyNumber
				})[0];
			} else {
				$scope.selectedPolicy = $scope.policies[0];
				$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/billing/report-premium/' + $scope.selectedPolicy.policyNumber);
			}

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions($scope.selectedPolicy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				policyNumber: $scope.policyNumber,
				role: $scope.role
			};


			if ($scope.selectedPolicy && $scope.selectedPolicy.policyType !== "PS") {
				getReports();
			} else {
				$scope.ps = true;
			}

			if ($scope.selectedPolicy !== undefined) {
				var policyStatus = $scope.selectedPolicy.status;
				var statusHTML = getStatusLabel(policyStatus);

				$scope.status = $sce.trustAsHtml(statusHTML);
			}
		};

		$scope.updatePolicy = function() {
			$scope.selectedPolicy = _.where($scope.policies, {
				policyNumber: $scope.selectedPolicy.policyNumber
			})[0];
			$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/billing/report-premium/' + $scope.selectedPolicy.policyNumber);
		};

		function getReports() {
			$scope.premiumreports = agentData.premiumreport.get({
				accountId: $stateParams.accountId,
				policyNumber: $stateParams.policyNumber
			});

			$scope.premiumreports.$promise.then(function(data) {
				if (data.data && data.data.length >= 1) {
					$scope.reports = data.data;
				} else if (data.succeeded === false) {
					$scope.message = "We are currently unable to access your available reports.  Please contact us at 1.800.231.1363 so that we can assist.";
					$scope.reports = true;
				}
				$scope.contentLoaded = true;
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});
		}

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// submit-report.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.billingModule')
		.controller('SubmitReportCtrl', SubmitReportCtrl);

	SubmitReportCtrl.$inject = ['$scope', '$location', '$sce', '$stateParams', '$http', '$filter', '_', 'agentCustomerPolicies', 'agentData', 'permsService', 'flashMessage'];

	function SubmitReportCtrl($scope, $location, $sce, $stateParams, $http, $filter, _, agentCustomerPolicies, agentData, permsService, flashMessage) {
		// initialize
		$scope.Math = window.Math;
		$scope.contentLoaded = false;
		$scope.isAgentUser = isAgentUser(); //variable used by View
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin(); //variable used by View
		$scope.flash = flashMessage;
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.policyNumber = $stateParams.policyNumber;

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			$scope.disableContentLoader = true;
			agentCustomerPolicies.account($scope);
		};

		$scope.postLoadDataAction = function(data) {
			$scope.policies = data.policies;
			$scope.customerName = data.guidewireAccount.accountName;
			var premiumreports = agentData.premiumreport.get({
				accountId: $stateParams.accountId,
				policyNumber: $stateParams.policyNumber
			});
			premiumreports.$promise.then(function(response) {
				if (response.succeeded && response.data.length > 0) {
					$scope.postPremiumReportsAction(response.data);
				} else {
					$scope.message = {
						type: 'error',
						msg: response.message
					};
				}
				$scope.contentLoaded = true;
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});

		};

		$scope.postPremiumReportsAction = function(data) {
			$scope.reports = data;
			$scope.selectedPolicy = $scope.reports[0].policy;
			$scope.status = $sce.trustAsHtml(getStatusLabel($scope.selectedPolicy.status));
			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions($scope.selectedPolicy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};

			$scope.report = _.where($scope.reports, {
				reportPeriodDueDate: $stateParams.reportPeriodDueDate
			})[0];
			if ($scope.report) {
				$scope.reportingPeriod = parseDate($scope.report.reportPeriodStartDate) + ' - ' + parseDate($scope.report.reportPeriodEndDate);
				orderThePayrollList();
			}
		};

		$scope.total = function() {
			var payrollTotal = 0;

			if ($scope.report) {
				$scope.report.payrolls.forEach(function(item) {
					payrollTotal += (item.grossPayrollAmount * 1);
				});
			}

			return payrollTotal;
		};

		/**
		 * Method will sort the payrolls list by classCode and locationCode
		 */
		function orderThePayrollList() {
			if ($scope.report && $scope.report.payrolls && $scope.report.payrolls) {
				$scope.report.payrolls = _.sortBy($scope.report.payrolls, function(item) {
					return [item.locationCode, item.classCode.classCode];
				});
				return $scope.report.payrolls;
			}
			return $scope.report.payrolls;
		}

		$scope.cancelURL = function() {
			return "/customer-policy-service/" + $scope.agencyCodes + "/" + $scope.accountId + "/billing/report-premium/" + $stateParams.policyNumber;
		};

		// process the form
		$scope.processForm = function() {
			$scope.contentLoaded = false;
			$http({
				method: 'POST',
				url: '/delegate/services/api/account/premiumreport',
				data: $scope.report, // pass in data as strings
				headers: {
					'Accept': 'application/json'
				} // set the headers so angular passing info as form data (not request payload)
			}).success(function(data) {
				if (data && data.succeeded) {
					flashMessage.set({
						body: 'Your amount owed for reporting period ' + $scope.reportingPeriod + ' is ' + $filter('currency')(data.data.currentPremium, '$') + ' and the adjustments to your premium will be shown on your next bill. You will receive a premium report advice via mail.',
						type: "success"
					});
					$location.path($scope.cancelURL());
				} else {
					var aMessage = (data && data.message) ? data.message : "Unable to process premium report.";
					$scope.message = {
						title: "Error!",
						msg: aMessage,
						type: "error"
					};
					$scope.contentLoaded = true;
				}
			});
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// certificates.module.js
(function() {
    'use strict';

    angular.module('agentApp.certificatesModule', []);

})();
// certificates-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.certificatesModule')
        .factory('certificatesConfig', certificatesConfig);

    function certificatesConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    colReorder: true,
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
        			"aaSorting": [
        				[1, "desc"]
        			],
        			"oLanguage": {
        				"sSearch": "Search:",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
        			}
        		};
            },

            getColumnDefs: function(){
                return [{
        			"aTargets": [0], // Column number which needs to be modified
        			"bSortable": false,
        			"mData": "certificateId",
        			"mRender": function(data, type, full) {
        				return '<input value="' + data + '" class="cert cert-num-' + data + '" type="checkbox" />';
        			},
        			sClass: 'tableCell'
        		}, {
        			"aTargets": [1],
        			"mData": "holder",
        			"mRender": function(data, type, full) {
        				if (data !== null) {
        					return '<a href="/web/guest/my-account-agent#/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/edit/' + $scope.policyNumber + '/' + $scope.policyPeriodId + '/' + full.certificateId + '">' + data.name + '</a>';
        				}
        				else {
        					return "Holder name not found.";
        				}
        			},
        			sClass: 'tableCell'
        		}, {
        			"aTargets": [2],
        			"mData": "displayName"
        		}, {
        			"aTargets": [3],
        			"mData": "location"
        		}, {
        			"aTargets": [4],
        			"mData": "jobId"
        		}, {
        			"aTargets": [5],
        			"mData": "subWaiverConsumer",
        			"mRender": function(data, type, full) {
        				return capitalizeFirstLetter(data);
        			}
        		}];
            }
        };
    }
})();

// certificates.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.certificatesModule')
		.controller('CertificatesCtrl', CertificatesCtrl);


	CertificatesCtrl.$inject = ['$scope', '$location', '$sce', '$route', '$stateParams', '$window', '_', 'permsService', 'flashMessage', 'agentCustomerPolicies', 'agentData', 'certificatesConfig'];

	function CertificatesCtrl($scope, $location, $sce, $route, $stateParams, $window, _, permsService, flashMessage, agentCustomerPolicies, agentData, certificatesConfig) {
		$scope.flash = flashMessage;
		$scope.isAgentUser = isAgentUser();
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.contentLoaded = false;
		$scope.columnDefs = certificatesConfig.getColumnDefs();

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			$scope.certPerms = true;
			agentCustomerPolicies.certsClaims($scope);
		};

		$scope.applyPolicyPerms = function(data) {
			$scope.customerName = data.guidewireAccount.accountName;
			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions(data.policies[0]);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};
		};

		$scope.applyCertificatePerms = function(data) {
			$scope.policies = data.policies;
			if ((!$stateParams.policyNumber) || (!$stateParams.policyPeriodId)) {
				if (typeof $scope.policies !== 'undefined' && $scope.policies.length > 0) {
					$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $scope.policies[0].policyNumber + '/' + $scope.policies[0].policyPeriods[0].policyPeriodId);
				}
				else {
					$window.location.replace("/web/guest/my-account-agent#/");
				}
			}
			else {
				$scope.certsResult = agentData.getCertificates.get({
					accountId: $scope.accountId,
					policyNumber: $stateParams.policyNumber,
					policyPeriodId: $stateParams.policyPeriodId
				});
				$scope.certsResult.$promise.then(function(data) {
					if (data.succeeded) {
						$scope.certificates = data.data;
					}
					else {
						$scope.message = {
							type: 'error',
							msg: data.message
						};
						$scope.contentLoaded = true;
					}
				})
                .catch(function(error){
                    vm.message = {
                        type: 'error',
                        msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
                    };
                    vm.contentLoaded = true;
                });

				$scope.policyNumber = $stateParams.policyNumber;
				$scope.policyPeriodId = $stateParams.policyPeriodId;
				$scope.selectedPolicy = _.where($scope.policies, {
					policyNumber: $scope.policyNumber
				})[0];
				$scope.policyPeriods = $scope.selectedPolicy.policyPeriods;
				$scope.selectedPolicyPeriod = _.where($scope.policyPeriods, {
					policyPeriodId: $scope.policyPeriodId
				})[0];

				var statusHTML = getStatusLabel($scope.selectedPolicy.status);
				$scope.status = $sce.trustAsHtml(statusHTML);
			}
		};

		//if no certsView permision redirect back to my-account
		if ($scope.certsView !== true && (typeof $scope.selectedPolicy !== 'undefined')) {
			$window.location.replace("/web/guest/my-account#/");
		}

		$scope.updatePolicy = function() {
			$scope.selectedPolicy = _.where($scope.policies, {
				policyNumber: $scope.selectedPolicy.policyNumber
			})[0];
			$scope.policyPeriods = $scope.selectedPolicy.policyPeriods;
			$scope.selectedPolicyPeriod = $scope.policyPeriods[0];
			$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $scope.selectedPolicy.policyNumber + '/' + $scope.selectedPolicyPeriod.policyPeriodId);
		};

		$scope.updatePolicyPeriod = function() {
			$scope.selectedPolicy = _.where($scope.policies, {
				policyNumber: $scope.selectedPolicy.policyNumber
			})[0];
			$scope.policyPeriods = $scope.selectedPolicy.policyPeriods;
			$scope.selectedPolicyPeriod = _.where($scope.policyPeriods, {
				policyPeriodId: $scope.selectedPolicyPeriod.policyPeriodId
			})[0];
			$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $scope.selectedPolicy.policyNumber + '/' + $scope.selectedPolicyPeriod.policyPeriodId);
		};

		$(document).on('click', "#checkAll", function() {
			$('input.cert:checkbox').not(this).prop('checked', this.checked);
		});

		$(document).on('click', "input[type='checkbox']", function() {
			var oTable = $('#dataTable').dataTable();

			if ($('input.cert:checked', oTable.fnGetNodes()).length > 0) {
				$(".delete-download button").removeAttr('disabled');
			}
			else {
				$(".delete-download button").attr('disabled', true);
			}
		});

		$scope.downloadCertificate = function() {
			var selectedCerts = [];
			var oTable = $('#dataTable').dataTable();
			var rowcollection = oTable.$("input:checkbox:checked.cert", {
				"page": "all"
			});
			rowcollection.each(function(index, elem) {
				selectedCerts.push($(elem).val());
			});
			if (selectedCerts.length > 1) {
				var $preparingFileModal = $("#preparing-file-modal");
				$preparingFileModal.modal('show');
				$.fileDownload('/delegate/services/certificates.zip?certIds=' + selectedCerts, {
					successCallback: function(url) {
						$preparingFileModal.modal('hide');
					},
					failCallback: function(responseHtml, url) {
						$preparingFileModal.modal('hide');
						$("#error-modal").modal('show');
					}
				});
			}
			else {
				$window.open('/delegate/services/certificate.pdf?certIds=' + selectedCerts);
			}
		};

		//
		// Method iterate over selected certs and deletes
		//
		$scope.deleteCertificate = function() {
			$scope.contentLoaded = false;
			var selectedCerts = $scope.selectedCerts();
			for (var i = 0; i < selectedCerts.length; i++) {
				if (selectedCerts[i]) {
					$.ajax({
						type: 'DELETE',
						url: '/delegate/services/api/certificates/' + selectedCerts[i],
						headers: {
							'Accept': 'application/json'
						},
						async: false
					});
				}
			}

			$scope.flash.set({
				title: "Success!",
				body: "Certificate(s) deleted successfully.",
				type: "success"
			});
			$route.reload();
		};
		// Method uses jquery selector to return array of selected certs
		$scope.selectedCerts = function() {
			var selectedCerts = $('input:checkbox:checked.cert').map(function() {
				return this.value;
			}).get();
			return selectedCerts;
		};
		// Method builds a delete conirm message for 'ngReallyClick' directive
		$scope.deleteConfirmMsg = function() {
			var length = $scope.selectedCerts().length;
			if (length == 1)
				return "Are you sure you want to delete the '1' selected record?";
			else
				return "Are you sure you want to delete the '" + length + "' selected records?";
		};
		//
		// -If userType CSR we don't care about the policy 'active' status
		// -If userType Customer we care about the policy 'active' status
		$scope.isCertsCreateButtonEnable = function() {
			if ($scope.isCSRorOMNI)
				return $scope.role && $scope.role.perm.certsCreate;
			else
				return $scope.selectedPolicyPeriod && isConsideredActive($scope.selectedPolicyPeriod.status) && $scope.role && $scope.role.perm.certsCreate;
		};
		//
		// -If userType CSR we don't care about the policy 'active' status
		// -If userType Customer we care about the policy 'active' status
		$scope.isCertsDeleteButtonEnable = function() {
			if ($scope.isCSRorOMNI)
				return $scope.role && $scope.role.perm.certsDelete;
			else
				return $scope.selectedPolicyPeriod && isConsideredActive($scope.selectedPolicyPeriod.status) && $scope.role && $scope.role.perm.certsDelete;
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// new-certificate.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.certificatesModule')
		.controller('CreateCertificateCtrl', CreateCertificateCtrl);


	CreateCertificateCtrl.$inject = ['$scope', '$http', '$location', '$stateParams', '_', 'permsService', 'flashMessage', 'agentCustomerPolicies'];

	function CreateCertificateCtrl($scope, $http, $location, $stateParams, _, permsService, flashMessage, agentCustomerPolicies) {
		$scope.flash = flashMessage;
		$scope.isAgentUser = isAgentUser();
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.contentLoaded = false;

		/**
		 * Method will fetch the getAgentCustomerPolicies data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			agentCustomerPolicies.certsClaims($scope);
		};

		$scope.applyPolicyPerms = function(data) {
			$scope.customerName = data.guidewireAccount.accountName;
			var policy = data.policies[0];
			$scope.selectedPolicy = _.where(data.policies, {
				policyNumber: $stateParams.policyNumber
			})[0];
			$scope.policyPeriod = _.where($scope.selectedPolicy.policyPeriods, {
				policyPeriodId: $stateParams.policyPeriodId
			})[0];
			$scope.classCodes = $scope.policyPeriod.classCodes;
			$scope.namedInsureds = $scope.policyPeriod.namedInsureds;
			setDefaultSelection();

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions(policy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};
		};

		/**
		 * Method returns if policyPeriod has waviers
		 */
		$scope.hasWaviers = function() {
			// dom will try to use hasWaviers() before callback returns
			// check for waivers before use; default to false if not set
			if ('policyPeriod' in $scope && 'waivers' in $scope.policyPeriod) {
				return $scope.policyPeriod.waivers !== null && $scope.policyPeriod.waivers.length >= 1;
			}
			else {
				return false;
			}
		};
		//Initialize the autoInputFieldObj
		if (typeof $scope.autoInputFieldObj === "undefined") {
			$scope.autoInputFieldObj = {
				"searchString": "",
				"type": ""
			};
		}
		//Initialize the certificate
		if (typeof $scope.certificate === "undefined") {
			$scope.certificate = {
				"holder": {
					"name": ""
				}
			};
		}
		/**
		 * Method watches 'autoInputFieldObj.searchString' then updates the certificate object
		 */
		$scope.$watch('autoInputFieldObj.searchString', function() {
			$scope.certificate.holder.name = $scope.autoInputFieldObj.searchString;
			$scope.certificate.subWaiverConsumer = $scope.autoInputFieldObj.type;
		});
		/**
		 * Method watches 'autoInputFieldObj.type' then updates the certificate object
		 */
		$scope.$watch('autoInputFieldObj.type', function() {
			$scope.certificate.holder.name = $scope.autoInputFieldObj.searchString;
			$scope.certificate.subWaiverConsumer = $scope.autoInputFieldObj.type;
		});

		$scope.subWaiverConsumerDisplayStr = function() {
			if ($scope.certificate.subWaiverConsumer)
				return capitalizeFirstLetter($scope.certificate.subWaiverConsumer);
			else
				return "N/A";
		};

		//Load states json file then set to states array
		$http.get('/certificates-portlet/js/states.json').then(function(data) {
			$scope.states = data.data;
		})
		.catch(function(error){
			vm.message = {
				type: 'error',
				msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
			};
			vm.contentLoaded = true;
		});

		//
		//Regardless if GW or PS policy set the default selection to the primary named insured.
		function setDefaultSelection() {
			if ($scope.namedInsureds !== null && $scope.namedInsureds.length > 0) {
				//Case1--Only one choice then use index zero
				if ($scope.namedInsureds.length == 1) {
					$scope.selectedNamedInsured = $scope.namedInsureds[0];
				}
				//Case2--Primary Insured is at index [0] so just return it
				else if ($scope.namedInsureds[0] && $scope.namedInsureds[0].isPrimaryNamedInsured === 'y') {
					$scope.selectedNamedInsured = $scope.namedInsureds[0];
				}
				//Case3--Primary Insured not at index [0] so run thru the list and find the indictator
				else {
					for (var i = 0; i < nameInsuredArray.length; i++) {
						var namedInsured = nameInsuredArray[i];
						if (namedInsured !== null && namedInsured.isPrimaryNamedInsured === 'y') {
							$scope.selectedNamedInsured = namedInsured;
							break;
						}
					}
				}
			}
		}

		//Method is used to find the nameInsured Object for name specified
		function selectNamedInsured(nameInsuredArray, name) {
			for (var i = 0; i < nameInsuredArray.length; i++) {
				var namedInsured = nameInsuredArray[i];
				if (namedInsured.name.toLowerCase().indexOf(name.toLowerCase()) != -1) {
					return namedInsured;
				}
			}
		}

		$scope.selectedCodes = [];

		$scope.someSelected = function(object) {
			return Object.keys(object).some(function(key) {
				return object[key];
			});
		};

		$scope.contentLoaded = true;

		// process the form
		$scope.processForm = function(isValid) {

			if (isValid) {

				$scope.contentLoaded = false;

				var classCodes = [];
				var descriptions = [];

				angular.forEach($scope.selectedCodes, function(code) {
					if (code) {
						if ($scope.selectedPolicy.policyType === "PS") {
							classCodes.push(code.classCode + '-' + code.classCodeSuffix);
						}
						else if ($scope.selectedPolicy.policyType === "GW") {
							classCodes.push(code.classCode);
						}
					}
				});

				angular.forEach($scope.selectedCodes, function(code) {
					if (code) {
						if ($scope.selectedPolicy.policyType === "PS") {
							descriptions.push(code.classCodeSuffixName);
						}
						else if ($scope.selectedPolicy.policyType === "GW") {
							descriptions.push(code.classCode + '-' + code.classCodeSuffixName);
						}
					}
				});

				var jobId;
				if ($scope.certificate.jobId) {
					jobId = $scope.certificate.jobId;
				}
				else {
					jobId = "";
				}

				var location;
				if ($scope.certificate.location) {
					location = $scope.certificate.location;
				}
				else {
					location = "";
				}

				$scope.json = {
					"hostSystem": $scope.selectedPolicy.policyType,
					"periodId": $scope.policyPeriod.policyPeriodId,
					"policyNumber": $scope.selectedPolicy.policyNumber,
					"effectiveDate": $scope.policyPeriod.effectiveDate,
					"expirationDate": $scope.policyPeriod.expirationDate,
					"certificateNumber": 1,
					"revisionNumber": 1,
					"jobId": jobId,
					"location": location,
					"displayName": $scope.selectedNamedInsured.name,
					"description": descriptions.join("\\n"),
					"offDutyOfficer": $scope.certificate.offDutyOfficer,
					"endeavorToCancel": $scope.certificate.endeavorToCancel,
					"subWaiver": false,
					"subWaiverFull": false,
					"subWaiverSched": false,
					"subWaiverConsumer": $scope.certificate.subWaiverConsumer,
					"renew": $scope.certificate.renew,
					"showInCareOf": $scope.certificate.showInCareOf,
					"addressOnBack": $scope.certificate.addressOnBack,
					"holder": {
						"policyPeriodId": $scope.policyPeriod.policyPeriodId,
						"name": $scope.certificate.holder.name,
						"careOfName": $scope.certificate.holder.careOfName,
						"address": {
							"addressLine1": $scope.certificate.holder.address.addressLine1,
							"addressLine2": $scope.certificate.holder.address.addressLine2,
							"city": $scope.certificate.holder.address.city,
							"state": $scope.selectedState.abbreviation,
							"postalCode": $scope.certificate.holder.address.postalCode,
							"country": "USA"
						},
						"email": ""
					},
					"classCodes": classCodes
				};

				$http({
					method: 'POST',
					url: '/delegate/services/api/certificates',
					data: $scope.json, // pass in data as strings
					headers: {
						'Accept': 'application/json'
					} // set the headers so angular passing info as form data (not request payload)
				}).success(function(data) {
					if (data.succeeded === false) {
						$scope.flash.set({
							title: "Error!",
							body: data.message,
							type: "error"
						});
						$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $stateParams.policyNumber + '/' + $stateParams.policyPeriodId);
					}
					else {
						$scope.flash.set({
							title: "Success!",
							body: "Certificate of Insurance created.",
							type: "success"
						});
						$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $stateParams.policyNumber + '/' + $stateParams.policyPeriodId);
					}
				});
			}
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// certificate.controllers.js
(function() {
	'use strict';

	angular
		.module('agentApp.certificatesModule')
		.controller('CertificateCtrl', CertificateCtrl);


	CertificateCtrl.$inject = ['$scope', '$http', '$location', '$stateParams', '_', 'permsService', 'flashMessage', 'agentCustomerPolicies', 'agentData'];

	function CertificateCtrl($scope, $http, $location, $stateParams, _, permsService, flashMessage, agentCustomerPolicies, agentData) {
		$scope.flash = flashMessage;
		$scope.isAgentUser = isAgentUser();
		$scope.isCSRorOMNI = isCSRUser() || isOMNIAdmin();
		$scope.accountId = $stateParams.accountId;
		$scope.agencyCodes = $stateParams.agencyCodes;
		$scope.contentLoaded = false;

		/**
		 * Method will fetch the getCertificates data from a defined dataService
		 */
		$scope.loadDataAction = function() {
			$scope.certsResult = agentData.getCertificates.get({
				accountId: $scope.accountId,
				policyNumber: $stateParams.policyNumber,
				policyPeriodId: $stateParams.policyPeriodId
			});
			$scope.certsResult.$promise.then(function(data) {
				if (data.data && data.data.length >= 1) {
					$scope.certificates = data.data;
					loadCert();
					getPolicy();
				}
				else {
					$scope.message = {
						type: 'error',
						msg: data.message
					};
					$scope.contentLoaded = true;
				}
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});
		};

		function getPolicy() {
			agentCustomerPolicies.certsClaims($scope);
		}

		$scope.applyPolicyPerms = function(data) {
			$scope.selectedPolicy = _.where(data.policies, {
				policyNumber: $stateParams.policyNumber
			})[0];
			$scope.policyPeriod = _.where($scope.selectedPolicy.policyPeriods, {
				policyPeriodId: $stateParams.policyPeriodId
			})[0];
			$scope.classCodes = $scope.policyPeriod.classCodes;
			$scope.namedInsureds = $scope.policyPeriod.namedInsureds;
			$scope.selectedNamedInsured = selectNamedInsured($scope.namedInsureds, $scope.certificate.displayName);
			$scope.customerName = data.guidewireAccount.accountName;
			var policy = data.policies[0];

			//Permissions based on policy selection
			$scope.role = permsService.updatePermissions(policy);

			$scope.menu = {
				accountName: $scope.customerName,
				agencyCodes: $scope.agencyCodes,
				accountId: $scope.accountId,
				role: $scope.role
			};
		};

		//Method is used to find the nameInsured Object for name specified
		function selectNamedInsured(nameInsuredArray, name) {
			for (var i = 0; i < nameInsuredArray.length; i++) {
				var namedInsured = nameInsuredArray[i];
				if (namedInsured.name.toLowerCase().indexOf(name.toLowerCase()) != -1) {
					return namedInsured;
				}
			}
		}

		//Method loads existing Certificate data
		function loadCert() {
			$scope.certificate = _.where($scope.certificates, {
				certificateId: $stateParams.certificateId * 1
			})[0];
			$scope.loader = false;
			$scope.contentLoaded = true;

			var certificateCodes = [];

			angular.forEach($scope.certificate.classCodes, function(certificateCode) {
				certificateCodes.push(certificateCode.split('-')[0]);
			});

			/**
			 * Method returns if policyPeriod has waviers
			 */
			$scope.hasWaviers = function() {
				// dom will try to use hasWaviers() before callback returns
				// check for waivers before use; default to false if not set
				if ('policyPeriod' in $scope && 'waivers' in $scope.policyPeriod) {
					return $scope.policyPeriod.waivers !== null && $scope.policyPeriod.waivers.length >= 1;
				}
				else {
					return false;
				}
			};

			//Initialize the autoInputFieldObj based on the cert values
			if (typeof $scope.autoInputFieldObj === "undefined") {
				$scope.autoInputFieldObj = {
					"searchString": $scope.certificate.holder.name,
					"type": $scope.certificate.subWaiverConsumer
				}; //initialize
			}

			/**
			 * Method watches 'autoInputFieldObj.searchString' then updates the certificate object
			 */
			$scope.$watch('autoInputFieldObj.searchString', function() {
				$scope.certificate.holder.name = $scope.autoInputFieldObj.searchString;
				$scope.certificate.subWaiverConsumer = $scope.autoInputFieldObj.type;
			});

			/**
			 * Method watches 'autoInputFieldObj.type' then updates the certificate object
			 */
			$scope.$watch('autoInputFieldObj.type', function() {
				$scope.certificate.holder.name = $scope.autoInputFieldObj.searchString;
				$scope.certificate.subWaiverConsumer = $scope.autoInputFieldObj.type;
			});

			$scope.subWaiverConsumerDisplayStr = function() {
				if ($scope.certificate.subWaiverConsumer)
					return capitalizeFirstLetter($scope.certificate.subWaiverConsumer);
				else
					return "N/A";
			};

			$scope.selectedCodes = [];
			angular.forEach(certificateCodes, function(certificateCode) {
				$scope.selectedCodes.push(_.where($scope.classCodes, {
					classCode: certificateCode
				})[0]);
			});

			$http.get('/certificates-portlet/js/states.json').then(function(data) {
				$scope.states = data.data;
				$scope.selectedState = _.where($scope.states, {
					abbreviation: $scope.certificate.holder.address.state
				})[0];
			})
			.catch(function(error){
				vm.message = {
					type: 'error',
					msg: 'There was a problem processing your request. Please contact us at 1.800.231.1363 so that we can assist.'
				};
				vm.contentLoaded = true;
			});

			$scope.loader = false;
			$scope.contentLoaded = true;

		}

		$scope.someSelected = function(object) {
			return Object.keys(object).some(function(key) {
				return object[key];
			});
		};

		// process the form
		$scope.processForm = function(isValid) {

			if (isValid) {

				$scope.contentLoaded = false;

				var classCodes = [];
				var descriptions = [];

				angular.forEach($scope.selectedCodes, function(code) {
					if (code) {
						if ($scope.selectedPolicy.policyType === "PS") {
							classCodes.push(code.classCode + '-' + code.classCodeSuffix);
						}
						else if ($scope.selectedPolicy.policyType === "GW") {
							classCodes.push(code.classCode);
						}
					}
				});

				angular.forEach($scope.selectedCodes, function(code) {
					if (code) {
						if ($scope.selectedPolicy.policyType === "PS") {
							descriptions.push(code.classCodeSuffixName);
						}
						else if ($scope.selectedPolicy.policyType === "GW") {
							descriptions.push(code.classCode + '-' + code.classCodeSuffixName);
						}
					}
				});

				$scope.json = {
					"hostSystem": $scope.certificate.hostSystem,
					"periodId": $scope.certificate.periodId,
					"holderId": $scope.certificate.holderId,
					"certificateId": $scope.certificate.certificateId,
					"policyNumber": $scope.certificate.policyNumber,
					"effectiveDate": $scope.certificate.effectiveDate,
					"expirationDate": $scope.certificate.expirationDate,
					"certificateNumber": $scope.certificate.certificateNumber,
					"revisionNumber": $scope.certificate.revisionNumber,
					"displayName": $scope.selectedNamedInsured.name,
					"description": descriptions.join("\\n"),
					"location": $scope.certificate.location,
					"jobId": $scope.certificate.jobId,
					"offDutyOfficer": $scope.certificate.offDutyOfficer,
					"subWaiver": $scope.certificate.subWaiver,
					"subWaiverFull": $scope.certificate.subWaiverFull,
					"subWaiverSched": $scope.certificate.subWaiverSched,
					"subWaiverConsumer": $scope.certificate.subWaiverConsumer,
					"endeavorToCancel": $scope.certificate.endeavorToCancel,
					"renew": $scope.certificate.renew,
					"showInCareOf": $scope.certificate.showInCareOf,
					"addressOnBack": $scope.certificate.addressOnBack,
					"holder": {
						"policyPeriodId": $scope.policyPeriod.policyPeriodId,
						"holderId": $scope.certificate.holderId,
						"name": $scope.certificate.holder.name,
						"careOfName": $scope.certificate.holder.careOfName,
						"address": {
							"addressLine1": $scope.certificate.holder.address.addressLine1,
							"addressLine2": $scope.certificate.holder.address.addressLine2,
							"city": $scope.certificate.holder.address.city,
							"state": $scope.selectedState.abbreviation,
							"postalCode": $scope.certificate.holder.address.postalCode,
							"country": "USA"
						},
						"email": ""
					},
					"classCodes": classCodes
				};

				$http({
					method: 'PUT',
					url: '/delegate/services/api/certificates',
					data: $scope.json, // pass in data as strings
					headers: {
						'Accept': 'application/json'
					} // set the headers so angular passing info as form data (not request payload)
				}).success(function(data) {
					if (data.succeeded === false) {
						$scope.message = {
							type: 'error',
							msg: data.message,
							title: "Error!"
						};
					}
					else {
						$scope.flash.set({
							title: "Success!",
							body: "Certificate of Insurance updated.",
							type: "success"
						});
						$location.path('/customer-policy-service/' + $scope.agencyCodes + '/' + $scope.accountId + '/certificates/' + $stateParams.policyNumber + '/' + $stateParams.policyPeriodId);
					}
				}).error(function(data, status, headers, config) {
					$scope.flash.set({
						title: "Error!",
						body: data.message,
						type: "error"
					});
				});
			}
		};

		//
		// -If userType CSR we don't care about the policy 'active' status
		// -If userType Customer we care about the policy 'active' status
		//
		$scope.isCertsSaveButtonEnable = function() {
			if ($scope.isCSRorOMNI)
				return $scope.certificateForm.$invalid;
			else
				return $scope.certificateForm.$invalid || !$scope.selectedPolicy || !isConsideredActive($scope.selectedPolicy.status);
		};

		//Liferay Extend session
		extendSessionWithAP();
	}
})();

// history.module.js
(function() {
    'use strict';

    angular.module('agentApp.historyModule', []);

})();

// history.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.historyModule')
        .factory('historyService', historyService);

    historyService.$inject = ['$q', 'historyData'];

    function historyService($q, historyData) {
        return {
        	getChargesHistoryPromise: function(params) {
                return historyData.chargesHistory.get(params).$promise;
            },
            getPaymentsHistoryPromise: function(params) {
                return historyData.paymentsHistory.get(params).$promise;
            },
            getChargesHistory: function(vm) {
                var deferred = $q.defer();
                return this.getChargesHistoryPromise({
					accountId: vm.accountId
				})
                .then(function(response) {
					if(response.succeeded) {
                        vm.billingData = response.data;
                        deferred.resolve(vm);
                    }
                    else{
                        deferred.reject(vm);
                    }
                    return deferred.promise;
                })
				.catch(function(vm){
                    deferred.reject(vm);
                    return deferred.promise;
				});
            },
            getPaymentsHistory: function(vm) {
                var deferred = $q.defer();
                return this.getPaymentsHistoryPromise({
					accountId: vm.accountId
				})
                .then(function(response) {
					if(response.succeeded) {
                        vm.creditData = response.data;
                        deferred.resolve(vm);
                    }
                    else{
                        deferred.reject(vm);
                    }
                    return deferred.promise;
                })
				.catch(function(vm){
                    deferred.reject(vm);
                    return deferred.promise;
				});
            }
        };
    }
})();

// chargesHistory-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.historyModule')
        .factory('billingConfig', billingConfig);

    function billingConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
                    "aaSorting": [
                        [0, "desc"]
                    ],
                    "oLanguage": {
                        "sSearch": "Search:",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
                    },
                    "lengthChange": true,
                    "pageLength": 50
                };
            },

            getColumnDefs: function(){
                return [{
                    "aTargets": [0],
                    "sTitle": "Date",
                    "mData": "chargeDate",
                    "sType": "date"
                }, {
                    "aTargets": [1],
                    "sTitle": "Charge Type",
                    "mData": "chargeType",
                    "sType": "string"
                }, {
                    "aTargets": [2],
                    "sTitle": "Context",
                    "mData": "context",
                    "sType": "string"
                }, {
                    "aTargets": [3],
                    "sTitle": "Amount",
                    "mData": "amount",
                    "sClass":"right",
        			"mRender": function ( data, type, full ) {
        				if(data) {
        					return '$'+toMoney(data);
        				}
        				else {
        					return '$0.00';
        				}
        			}
                }];
            }
        };
    }
})();

// paymentsHistory-config.service.js
(function() {
    'use strict';

    angular
        .module('agentApp.historyModule')
        .factory('creditConfig', creditConfig);

    function creditConfig() {
        return {
            getOverrideOptions: function() {
                return {
                    stateSave: true,
                    stateDuration: 2419200, /* 1 month */
                    dom: 'Bfrtip',
                    buttons: [
                        "colvis",
                        // sample custom button
                        /*{
                            text: 'Button 1',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button 1 clicked on' );
                            }
                        }*/
                    ],
                    "aaSorting": [
                        [0, "desc"]
                    ],
                    "oLanguage": {
                        "sSearch": "Search:",
                        buttons: {
                            colvis: '<span class="icon-columns icon-large" title="Show / Hide Columns" alt="Show / Hide Columns"></span>'
                        }
                    },
                    "lengthChange": true,
                    "pageLength": 50
                };
            },

            getColumnDefs: function(){
                return [{
                    "aTargets": [0],
                    "sTitle": "Date",
                    "mData": "paymentDate",
                    "sType": "date"
                }, {
                    "aTargets": [1],
                    "sTitle": "Payment Method",
                    "mData": "paymentType",
                    "sType": "string"
                }, {
                    "aTargets": [2],
                    "sTitle": "Reference",
                    "mData": "checkRef",
                    "sType": "string"
                }, {
                    "aTargets": [3],
                    "sTitle": "Amount",
                    "mData": "amount",
                    "sClass":"right",
        			"mRender": function ( data, type, full ) {
        				if(data) {
        					return '$'+toMoney(data);
        				}
        				else {
        					return '$0.00';
        				}
        			}
                }, {
                    "aTargets": [4],
                    "sTitle": "Amount Distributed",
                    "mData": "amountDistributed",
                    "sClass":"right",
        			"mRender": function ( data, type, full ) {
        				if(data) {
        					return '$'+toMoney(data);
        				}
        				else {
        					return '$0.00';
        				}
        			}
                }];
            }
        };
    }
})();
