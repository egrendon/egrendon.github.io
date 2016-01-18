(function() {
    'use strict';

    /* App Module */
    angular.module('myFirstApp', [
        'myFirstApp.core',
        'myFirstApp.services',
        'myFirstApp.directives',
        /*
         * Feature Sets
         */
        'myFirstApp.homeModule'
    ]);

})();

(function() {
    'use strict';

    angular
        .module('myFirstApp')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        
    	//
    	// Define default page
    	//
    	$urlRouterProvider.otherwise("/home");

    	//
    	// Define routes
    	//
        $stateProvider
			.state('home', {
				url:'/home',
				templateUrl: '/app/featureSets/home/home.html',
				controller: 'HomeCtrlAs',
				controllerAs: 'vm'
			})
            .state('/globalWeather', {
                url: '/globalWeather',
                templateUrl: '/app/featureSets/globalWeather/global-weather.html',
                controller: 'GlobalWeatherCtrlAs',
                controllerAs: 'vm'
            });
    }
})();

(function() {
    'use strict';

    angular.module('myFirstApp.core', [
        /*
         * Angular modules
         */


         /*
         * Our reusable cross app code modules
         */
        'myFirstApp.services',
        'myFirstApp.directives',
        'myFirstApp.modelObjects',
        
        /*
         * 3rd Party modules
         */
        'ui.bootstrap',
        'ui.router',
    ]);
})();

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

(function() {
    'use strict';

    angular.module('myFirstApp.directives', ['ui.bootstrap']);

})();
/**
 * Directive used to inject animation styles into the DOM when an element comes into view. 
 * NOTE: Assumes the project is using Animation.css framework.
 * Optionally you can disable for mobile mode. See commented out code.
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrAnimateInView', egrAnimateInView);

    function egrAnimateInView($window, $timeout) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "animateCss": "@",
                "animateDelay": "@",
            },
            //template: '',
            link: link,
            //controller: controller
        };

        return directive;

        function link(scope, element, attrs) {
            //hide the element
            var itemElement = angular.element(element);
            itemElement.css('opacity', 0);

            // // Disable all animation effects for mobile
            // if (jQuery.browser.mobile === true) {
            //     addStylesToElement();
            //     return;
            // }

            //IF the element is viewable then add a class
            if (itemElement[0].y < $window.innerHeight) {
                addStylesToElement();
            }

            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (itemElement[0].getBoundingClientRect().top < $window.innerHeight) {
                    if (scope.animateDelay) {
                        $timeout(addStylesToElement, scope.animateDelay);
                    } else {
                        addStylesToElement();
                    }
                    scope.$apply();
                }
            });

            function addStylesToElement() {
                itemElement.addClass(scope.animateCss);
                itemElement.css('opacity', 1);
            }
        }

        //        function controller($scope) {
        //          
        //        }
    }
})();

/**
 * Directive used to circle charts. 
 * NOTE: Assumes the project is using Animation.css framework.
 * Optionally you can disable for mobile mode. See commented out code.
 */
(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrChartCircle', egrChartCircle);

    function egrChartCircle($window) {
        var directive = {
            restrict: 'AE',
            "scope": {
                "percent": "=",
                "value": "@"
            },
            template: '<div class="col-sm-4 col-md-2">' +
                        '<div class="item">' +
                            '<div class="circle">' +
                                '<span class="item-progress" data-percent="{{percent}}"></span>' +
                            '</div>' +
                            '<span class="percent">{{percent}}%</span>' +
                            '<h4 class="text-center">{{value}}</h4>' +
                        '</div>' +
                    '</div>',
            replace: true, //element to which the directive declared should be replaced with template
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            // initialize
            var bascisElement = element[0].querySelector('.item-progress');
            var itemElement = angular.element(bascisElement);
            var maxHeight = 108;
            var newHeight = maxHeight * (scope.percent / 100);

            // // Disable all animation effects for mobile
            // if (jQuery.browser.mobile === true) {
            //     addStylesToElement();
            //     return;
            // }

            //IF the element is viewable then add a class
            if (itemElement[0].y < $window.innerHeight) {
                addStylesToElement();
            }

            // Bind the window scroll event
            angular.element($window).bind("scroll", function() {
                if (itemElement[0].getBoundingClientRect().top < $window.innerHeight) {
                    addStylesToElement();
                    scope.$apply();
                }
            });


           function addStylesToElement() {
                itemElement.addClass('animated fadeIn ');
                itemElement.css('height', newHeight+"px");
            }
        }
    }
})();

/**
 * Directive used to call Google Maps API.
 * Set your google maps parameters. If you unable to find latitude and longitude of your address. 
 * Please visit http://www.latlong.net/convert-address-to-lat-long.html 
 * you can easily generate latitue and longitude.
 */
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrGoogleMaps', egrGoogleMaps);

	function egrGoogleMaps() {
		var directive = {
			restrict: 'AE',
			"scope": {
				"address": "@",
				"latitude": "@",
				"longitude": "@",
				"mapZoom": "@",
			},

			template: '<div id="map">'+
							'<div class="address">'+
						        '<h4>{{address}}</h4>'+
						    '</div>'+
						    '<div id="cd-google-map">'+
						        '<div id="google-container"></div>'+
						    '</div>'+
						'</div>',
            replace: true, //element to which the directive declared should be replaced with template        
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (!scope.latitude || !scope.longitude) {
				throw new Error("Missing a required attribute.");
			}

            // Initial LOAD: when the element has finished loading 
            element.ready(function(){
		        var $latitude = scope.latitude,
		            $longitude = scope.longitude,
		            $map_zoom = (!scope.mapZoom) ? 10 : scope.mapZoom; // Default to 10 if not found

		        // Google map custom marker icon
		        var $marker_url = 'assets/img/map-marker-icon.png';

		        // We define here the style of the map (https://snazzymaps.com/style/38/shades-of-grey)
		        var style = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}];

		        // Set google map options
		        var map_options = {
		            center: new google.maps.LatLng($latitude, $longitude),
		            zoom: $map_zoom,
		            panControl: true,
		            zoomControl: true,
		            mapTypeControl: false,
		            streetViewControl: true,
		            mapTypeId: google.maps.MapTypeId.ROADMAP,
		            scrollwheel: false,
		            styles: style
		        };

		        // Inizialize the map
		        var containerElement = document.getElementById('google-container');
		        var map = new google.maps.Map(containerElement, map_options);

		        // Add a custom marker to the map               
		        var marker = new google.maps.Marker({
		            position: new google.maps.LatLng($latitude, $longitude),
		            map: map,
		            visible: true,
		            icon: $marker_url
		        });
            });
		}

//      function controller($scope) {	
//		}
	}
})();

/**
 * Directive used to display a Image in card layout
 * Requires jQuery Magnific Popup plugin.
 */
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrImageCard', egrImageCard);

	function egrImageCard() {
		var directive = {
			restrict: 'AE',
			"scope": {
				"title": "@",
				"imageSrc": "@",
			},

			template: '<div class="item col-sm-6 col-md-3">' +
                        '<div class="project-wrapper dark-bg">' +
                            '<div class="project-link">' +
                                '<a href="{{imageSrc}}" class="zoom text-center" title="{{title}}">' +
                                    '<i class="icon-Full-Screen"></i>' +
                                '</a>' +
                                // '<a href="#/single-portfolio-1" class="external-link">' +
                                //     '<i class="icon-Link"></i>' +
                                // '</a>' +
                            '</div>' +
                            //'<div class="project-title"><h5>{{title}}</h5></div>'+
                            '<img src="{{imageSrc}}" class="img-responsive small-thumnail" />'+
                            '<div style="padding:10px 10px; margin-bottom:10px;">'+
                            	//'<h4 class="text-center">{{title}}</h4>'+
                            	 '<div ng-transclude egr-match-height></div>'+
                        	'</div>'+
                        '</div>' +
                    '</div>',
            replace: true, //element to which the directive declared should be replaced with template        
			transclude: true, //allow HTML into angular directive 
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			//TODO: I know that i am initalizing the magnificPopup multiple times 
			//(ever time this directive is declared). But as of right now this is the 
			//only quick way to make this work. If i have time I will revist this later.
		    if ($.fn.magnificPopup){
		        $("#portfolio-gallery").magnificPopup({
		            delegate: 'a.zoom',  // child item selector, by clicking on it popup will open
		            type: 'image',
		            fixedContentPos: false,

		            // Delay in milliseconds before popup is removed
		            removalDelay: 300,

		            // Class that is added to popup wrapper and background
		            mainClass: 'mfp-fade',

		            gallery: {
		                enabled: true,
		                preload: [0,2],
		                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		                tPrev: 'Previous Project',
		                tNext: 'Next Project'
		            }
		        });
		    }
		    else 
		    	throw new Error("unable to detected the need framework 'magnificPopup' please check included libs");
		}


//      function controller($scope) {
//		}
	}
})();

(function() {
    'use strict';

    angular
        .module('myFirstApp.directives')
        .directive('egrLoader', egrLoader);

    function egrLoader() {
        var directive = {
            restrict: 'AE',
			template: '<div class="sk-cube-grid">'+
					'<div class="sk-cube sk-cube1"></div>'+
					'<div class="sk-cube sk-cube2"></div>'+
					'<div class="sk-cube sk-cube3"></div>'+
					'<div class="sk-cube sk-cube4"></div>'+
					'<div class="sk-cube sk-cube5"></div>'+
					'<div class="sk-cube sk-cube6"></div>'+
					'<div class="sk-cube sk-cube7"></div>'+
					'<div class="sk-cube sk-cube8"></div>'+
					'<div class="sk-cube sk-cube9"></div>'+
				'</div>',
			//link: link,
			//controller: controller
        };

        return directive;

//        function link(scope, element, attrs, ngModel) {
//        	
//        }
//        
//        function controller($scope) {
//        	
//        }
    }
})();

/**
 * Directive used to match all the children of the directive element.
 * All the children elements will be matched up by height.
 */
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrMatchHeight', egrMatchHeight);

	function egrMatchHeight($window) {
		var directive = {
			restrict: 'AE',
			"scope": {
				"matchingCss": "@"
			},
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
            var i;
            var heightsArray = [];
            var largest = 0;
            /**
             * Return the largest number in the array
             * @name largetsNo
             * @param  {Array} array - The array of heights
             * @return {Number} the largest number
             */
            var largetsNo = function( array ){
                return Math.max.apply( Math, array );
            };

            var adjustHeight = function(){
           		// Find the element by its class attribute, within your controller's scope
	           	var myElements = element[0].children;
	           	if (!myElements || (myElements && myElements.length === 0)) {
	        		throw new Error("zero children found for elements where directive is declared");
	        	}

                // loop through all the children and get their heights
                for ( i = 0; i < myElements.length; i++) {

                    // add the heights to the array if not undefined
                    // e.g a comment will be picked up
                    if( myElements[i].offsetHeight ){
                        heightsArray.push( myElements[i].offsetHeight );
                    }
                }

                // get the largest height
                largest = largetsNo( heightsArray );

                // add the height to the children
                for ( i = 0; i < myElements.length; i++) {
                	var itemElement = angular.element(myElements[i]);
                	itemElement.css( 'height', largest + 'px' );
                }
            };

            // Initial LOAD: when the element has finished loading 
            element.ready(function(){
            	adjustHeight();
            });

            // On browser window resize event
            angular.element($window).bind('resize', function(){
            	// first remove style attribute from monitored elements
            	var myElements = element[0].children;
                for ( i = 0; i < myElements.length; i++) {
                	$(myElements[i]).removeAttr("style");
                }
            	// then call height adjust
            	adjustHeight();
	       });



		}

//      function controller($scope) {
//	
//		}
	}
})();

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
        .directive('egrMessagePanel', egrMessagePanel);

    egrMessagePanel.$inject = ['nextMessageService'];

    function egrMessagePanel(nextMessageService) {
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

/*-------------------------------------------------------------------*/
/*  Directive creates the page smooth scrolling feature, requires jQuery Easing plugin. */
/*-------------------------------------------------------------------*/
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrPageScroll', egrPageScroll);

	function egrPageScroll() {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (!attrs.id) {
				throw new Error("Missing a required attribute 'id'.");
			}

            // Initial LOAD: when the element has finished loading 
            element.ready(function(){
            	pageScroll();
            });



            /*-------------------------------------------------------------------*/
		    /*  4. Page scrolling feature, requires jQuery Easing plugin.
		    /*-------------------------------------------------------------------*/
		    var pageScroll = function(){

		    	//For this element select find all HREF tages that have class page-scroll 
		    	var selectorId = "#"+attrs.id + " .page-scroll > a";
		    	var foundElements = $(selectorId);

		    	if (!foundElements || foundElements.length === 0) {
					throw new Error("Zero HREF elements fond with class 'page-scroll'.");
				}

		        foundElements.bind('click', function(e){
		            e.preventDefault();
		            
		            var anchor = $(this),
		            href = anchor.attr('href'),
		            offset = $('body').attr('data-offset');
		            
		            $('html, body').stop().animate({
		                scrollTop: $(href).offset().top - (offset - 1)
		            }, 1500, 'easeInOutExpo');
		            
		            /*
		             * Automatically retract the navigation after clicking 
		             * on one of the menu items.
		             */
		            if(!$(this).parent().hasClass('dropdown')){
		                $('.egr-collapse').collapse('hide');
		            }
		        });
		    };
		}

//      function controller($scope) {
//	
//		}
	}
})();

/*-------------------------------------------------------------------*/
/*  Directive does the parallax background effect. Requires skrollr js library.
/*  Github project is here https://github.com/Prinzhorn/skrollr
/*  Examples can be found here https://github.com/Prinzhorn/skrollr/tree/master/examples
/*-------------------------------------------------------------------*/
(function(skrollr) {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrParallax', egrParallax);

	function egrParallax() {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (!attrs.id) {
				throw new Error("Missing a required attribute 'id'.");
			}

			if (jQuery.browser.mobile === false) {
				// This is for parallax using Skrollr
				var s = skrollr.init({
					forceHeight: false
				});

				var  jQueryElementIDSelector = "#"+attrs.id+" > .parallax";

				// Refresh skrollr after resizing our sections
				s.refresh($(jQueryElementIDSelector));

				//skrollr.init().refresh();
			}
		}

//      function controller($scope) {
//	
//		}
	}
})(skrollr);

/*-------------------------------------------------------------------*/
/*  Directive creates a docked naviaton menu. The navigation menu stays always visible.
/*  Requires jQuery-Sticky plugin.
/*-------------------------------------------------------------------*/
(function() {
	'use strict';

	angular
		.module('myFirstApp.directives')
		.directive('egrStickyMenu', egrStickyMenu);

	function egrStickyMenu($window) {
		var directive = {
			restrict: 'AE',
			//template: '',
			link: link,
			//controller: controller
		};

		return directive;

		function link(scope, element, attrs, ngModel) {
			if (!attrs.id) {
				throw new Error("Missing a required attribute 'id'.");
			}

            // Initial LOAD: when the element has finished loading 
            element.ready(function(){
            	stickyMenuHelper();
            });


            // On browser window resize event
            angular.element($window).bind('resize', function(){
				stickyMenuHelper();
	       	});

		    /*-------------------------------------------------------------------*/
		    /*  5. Make navigation menu on your page always stay visible.
		    /*  Requires jQuery-Sticky plugin.
		    /*-------------------------------------------------------------------*/
		    var stickyMenuHelper = function(){
		    	var jQueryElementID = "#"+attrs.id
		        var ww = Math.max($(window).width(), window.innerWidth),
		        nav = $(jQueryElementID);

		        if ($.fn.unstick){
		            nav.unstick();
		        }
		        
		        if ($.fn.sticky && ww >= 992){
		            nav.sticky({topSpacing: 0});
		        }
		    };
		}

//      function controller($scope) {
//	
//		}
	}
})();

(function() {
    'use strict';

    angular.module('myFirstApp.modelObjects', []);

})();
(function() {
	'use strict';
	window.MODEL = window.MODEL || {};
}());

//MessageObj Object treated as a module
MODEL.MessageObj = (function() {
	'use strict';
	
	/**
	 * MessageObj constructor used to create a MessageObj instance.
	 * @param type
	 * @param title
	 * @param msg
	 **/
	function MessageObj(type, msg) {
		if (!type || type.length === 0)
			throw new Error("type is now allowed to be null/empty.");
		if (!msg || msg.length === 0)
			throw new Error("msg is now allowed to be null/empty.");
		
		
		this.type = type;
		this.title = capitalizeFirstLetter(this.type);
		this.msg = msg;
	}
	
	function capitalizeFirstLetter(string) {
		if (string && string.length > 0)
			return string.charAt(0).toUpperCase() + string.slice(1);
		else
			return "";
	}

	/**
	 * Shared prototype object on every instance of MessageObj.
	 **/
	MessageObj.prototype = {
		//Resetting the prototype constructor property to point MessageObj not Object
		constructor : MessageObj,

		getType : function() {
			return this.type;
		},

		getTitle : function() {
			return this.title;
		},
		
		setTitle : function(title) {
			this.title = title;
			return this.title;
		},

		getMsg : function() {
			return this.msg;
		},
		
		getMessageObj : function() {
			return this;
		},

		/**
		 * Clear Message object
		 **/
		resetMessageObj : function() {
			this.type = null;
			this.title = null;
			this.msg = null;
		},

		hasMsg : function() {
			return this.getMsg() && this.getMsg().length > 0;
		},
		
		/**
		 * Stringify the MessageObj object.
		 **/
		toString : function() {
			var output = 'type=' + this.getType() + "         title="+ this.getTitle() + "         msg="+ this.getMsg();
			return output;
		}
	};

	//Return reference to the MessageObj Object Constructor
	return MessageObj;
}());

/** Declare a window variable **/
angular.module('myFirstApp.modelObjects', [])
	.value('MessageObj', MODEL.MessageObj);

(function() {
    'use strict';

    angular.module('myFirstApp.services', ['ngResource']);

})();
(function() {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('globalWeatherService', globalWeatherService);

    globalWeatherService.$inject = ['myFirstBaseService'];

    function globalWeatherService(myFirstBaseService) {
        return {
        	getWeatherCitiesForCountryPromsie: function(aCountryName) {
        		return myFirstBaseService.weatherCitiesForCountry.get({countryName:aCountryName}).$promise;
        	},
        	
        	getWeatherForCityPromise: function(aCountryName, aCityName) {
        		return myFirstBaseService.weatherForCity.get({countryName:aCountryName, cityName:aCityName}).$promise;
        	},
        	         
            getWeatherCitiesForCountry: function(vm) {
            	if (!vm.countryName)
            		throw new Error("The param 'countryName' is not allowed to be null.");
            	
            	this.getWeatherCitiesForCountryPromsie(vm.countryName).then(function(response) {
                    if (response.succeeded) {
                    	vm.weatherCitiesForCountryResponse = response;
                    	var data = response.data;
                    	vm.citiesForCountry = data.NewDataSet.Table;
                        vm.postLoadDataAction();
                        vm.contentLoaded = true;
                    } else {
                        vm.messageObj = new MODEL.MessageObj('error', response.msg);
                        vm.contentLoaded = true;
                    }
                })
                .catch(function(error){
                    vm.messageObj = new MODEL.MessageObj('error', 'There was a problem processing your request.');
                    vm.contentLoaded = true;
                });
            },
            getWeatherForCity: function(vm) {
            	if (!vm.countryName)
            		throw new Error("The param 'countryName' is not allowed to be null.");
            	if (!vm.cityName)
            		throw new Error("The param 'cityName' is not allowed to be null.");
            	
            	this.getWeatherForCityPromise(vm.countryName, vm.cityName).then(function(response) {
                    if (response.succeeded) {
                    	vm.weatherCitiesForCountryResponse = response;
                    	var data = response.data;
                    	vm.cityWeather = data.CurrentWeather;
                        vm.postLoadDataAction();
                        vm.contentLoaded = true;
                    } else {
                    	vm.messageObj = new MODEL.MessageObj('error', response.msg);
                        vm.contentLoaded = true;
                    }
                })
                .catch(function(error){
                    vm.messageObj = new MODEL.MessageObj('error', 'There was a problem processing your request.');
                    vm.contentLoaded = true;
                });
            }
        };
    }
})();

(function() {
	'use strict';

	angular
		.module('myFirstApp.services')
		.factory('myFirstBaseService', myFirstBaseService);

	myFirstBaseService.$inject = ['$resource', 'serviceConfigConstant'];

	function myFirstBaseService($resource, serviceConfigConstant) {

		return {			
			myAccount: $resource('/delegate/services/api/myaccount', {}, serviceConfigConstant),
			weather: $resource('/delegate/services/api/weather', {}, serviceConfigConstant),
			weatherCitiesForCountry: $resource('/delegate/services/api/weather/:countryName', {}, serviceConfigConstant),
			weatherForCity: $resource('/delegate/services/api/weather/:countryName/:cityName', {}, serviceConfigConstant)
		};
	}

})();

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

(function(_) {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('_', underscore);



    function underscore() {
        return _;
    }

})(_);

(function() {
    'use strict';

    angular.module('myFirstApp.homeModule', []);

})();

(function() {
    'use strict';

    angular
        .module('myFirstApp.homeModule')
        .controller('HomeCtrlAs', HomeCtrlAs);

    //HomeCtrlAs.$inject = ['homeService'];

//console.dir(PrintToConsole);
    function HomeCtrlAs() {
        var vm = this;
        vm.resultData = null;

        vm.myAccountAction = function() {
            vm.resultData = homeService.getMyAccount(vm);
        };

        vm.getWeatherAction = function() {
            vm.resultData = homeService.getWeather(vm);
        };

        vm.saveWeatherAction = function() {
            vm.weatherModel = {
                status: "This is PUT angular",
                some: "angular something here"
            };
            vm.resultData = homeService.saveWeather(vm);
        };

    } //end of Ctrl	
})();

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

angular.module('myFirstApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/featureSets/footer/contact.html',
    "<!-- CONTACT SECTION START -->\r" +
    "\n" +
    "<section id=\"contact\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-12 text-center\">\r" +
    "\n" +
    "                    <h2 class=\"section-title\">Contact Me</h2>\r" +
    "\n" +
    "                    <p class=\"section-subtitle\">\r" +
    "\n" +
    "                        Have a question or project you'd like to discuss?\r" +
    "\n" +
    "                    </p>\r" +
    "\n" +
    "                    <span class=\"divider\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-12 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "            <div class=\"row\" egr-match-height>\r" +
    "\n" +
    "                <div class=\"col-sm-7 col-md-6 text-center\">\r" +
    "\n" +
    "                    <div class=\"contact-details text-center\">\r" +
    "\n" +
    "                        <div class=\"speech-bubble\">\r" +
    "\n" +
    "                            <h3>Details</h3>\r" +
    "\n" +
    "                            <ul class=\"list-unstyled text-colored-grey\">\r" +
    "\n" +
    "                                <li>Ernesto Rendon</li>\r" +
    "\n" +
    "                                <li><a href=\"tel:1-520-304-9917\">1-520-304-9917</a></li>\r" +
    "\n" +
    "                                <li><a href=\"https://github.com/egrendon\" TARGET=\"_blank\">www.github.com/egrendon</a></li>\r" +
    "\n" +
    "                                <li><a href=\"http://codepen.io/egrendon/\" TARGET=\"_blank\">www.codepen.io/egrendon</a></li>\r" +
    "\n" +
    "                                <li><a href=\"https://jsfiddle.net/user/egrendon/fiddles/\" TARGET=\"_blank\">www.jsfiddle.net/egrendon</a></li>\r" +
    "\n" +
    "                            </ul>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col-sm-5 col-md-6\">\r" +
    "\n" +
    "                    <!-- CONTACT DETAILS START -->\r" +
    "\n" +
    "                    <div class=\"contact-details text-center\">\r" +
    "\n" +
    "                        <div class=\"speech-bubble\">\r" +
    "\n" +
    "                            <a href=\"mailto:egrendon@gmail.com?subject=EGR Site:\">\r" +
    "\n" +
    "                            <i class=\"icon-Speach-Bubble11\"></i>\r" +
    "\n" +
    "                            </a>\r" +
    "\n" +
    "                            <h4 class=\"text-colored-grey\">\r" +
    "\n" +
    "                                    Email<br>Me\r" +
    "\n" +
    "                                </h4>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <h4 class=\"text-colored-grey\"><a href=\"mailto:egrendon@gmail.com?subject=EGR Site:\">egrendon@gmail.com</a></h4>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //CONTACT DETAILS END -->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-12 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //CONTACT SECTION END -->\r" +
    "\n" +
    "<!-- MAP START -->\r" +
    "\n" +
    "<div egr-google-maps address=\"2901 E Greenway Rd, Phoenix, AZ 85032\" latitude=\"33.625761\" longitude=\"-112.019004\">\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- //MAP END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/footer/footer.html',
    "<!-- FOOTER START -->\r" +
    "\n" +
    "<footer class=\"footer\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div egr-page-scroll id=\"backToHomeButtonId\">\r" +
    "\n" +
    "                    <div class=\"page-scroll\">\r" +
    "\n" +
    "                        <a href=\"#home\"><i class=\"icon-Arrow-Up\"></i></a>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.page-scroll -->\r" +
    "\n" +
    "                <ul class=\"list-inline social-icons\">\r" +
    "\n" +
    "                    <li>\r" +
    "\n" +
    "                        <div class=\"item\">\r" +
    "\n" +
    "                            <a href=\"http://www.facebook.com/ernie.g.rendon\" target=\"_blank\"><i class=\"fa fa-facebook\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.item -->\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <!-- <li>\r" +
    "\n" +
    "                        <div class=\"item\">\r" +
    "\n" +
    "                            <a href=\"#\" target=\"_blank\"><i class=\"fa fa-twitter\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li> -->\r" +
    "\n" +
    "                    <li>\r" +
    "\n" +
    "                        <div class=\"item\">\r" +
    "\n" +
    "                            <a href=\"https://www.linkedin.com/in/egrendon\" target=\"_blank\"><i class=\"fa fa-linkedin\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.item -->\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <!-- <li>\r" +
    "\n" +
    "                        <div class=\"item\">\r" +
    "\n" +
    "                            <a href=\"#\" target=\"_blank\"><i class=\"fa fa-dribbble\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </li> -->\r" +
    "\n" +
    "                    <li>\r" +
    "\n" +
    "                        <div class=\"item\">\r" +
    "\n" +
    "                            <a href=\"https://www.pinterest.com/ernestorendon/\" target=\"_blank\"><i class=\"fa fa-pinterest\"></i></a>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.item -->\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.col-md-12 -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.row -->\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div class=\"copyright text-center\">\r" +
    "\n" +
    "                    <p class=\"text-colored-grey\">&copy; 2016 Ernesto Rendon. All rights reserved.</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.copyright -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.col-md-12 -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.row -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</footer>\r" +
    "\n" +
    "<!-- //FOOTER END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/home/hero.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!-- 3. add the sn-skrollr directive, along with skrollr animation attributes, to the elements you wish to animate -->\r" +
    "\n" +
    "<!-- <div\r" +
    "\n" +
    "  egr-parallax\r" +
    "\n" +
    "  data-100p-top=\"transform: translateY(900px)\"\r" +
    "\n" +
    "  data-top=\"transform: translateY(0px)\"\r" +
    "\n" +
    "  data--100p-top=\"transform: translateY(-900px)\"\r" +
    "\n" +
    ">\r" +
    "\n" +
    "  this div should have paralex stuff...................................\r" +
    "\n" +
    "</div> -->\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/home/home.html',
    "<div ng-include=\"'/app/featureSets/home/hero.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/topNavMenu/topNavMenu.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/resume/profile.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/portfolio/portfolio.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/skills/services.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/skills/strengths.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/resume/resume.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/skills/skills.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/footer/contact.html'\"></div>\r" +
    "\n" +
    "<div ng-include=\"'/app/featureSets/footer/footer.html'\"></div>\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/leftMenuBar/leftMenuBar.html',
    "<!-- NAVIGATION -->\r" +
    "\n" +
    "<md-sidenav layout=\"column\" class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia('gt-md')\">\r" +
    "\n" +
    "\t<md-content layout=\"column\" layout-padding ng-controller=\"LeftMenuBarCtrl\">\r" +
    "\n" +
    "\t\t<!-- <md-button class=\"md-primary\" ui-sref=\"home\">Home</md-button>\r" +
    "\n" +
    "\t\t<md-button class=\"md-primary\" ui-sref=\"sell\">Sell</md-button>\r" +
    "\n" +
    "\t\t<md-button class=\"md-primary\">Link 3</md-button>\r" +
    "\n" +
    "\t\t <ul class=\"nav navbar-nav\">\r" +
    "\n" +
    "        \t<li><a ui-sref=\"home\">Home</a></li>\r" +
    "\n" +
    "        \t<li><a ui-sref=\"about\">About</a></li>\r" +
    "\n" +
    "    \t</ul> -->\r" +
    "\n" +
    "    \t<md-button md-raised md-primary layout-fill href=\"#/home\">Home</md-button>\r" +
    "\n" +
    "    \t<md-button md-raised md-primary layout-fill href=\"#/globalWeather\">Global Weather</md-button>\r" +
    "\n" +
    "    \t<md-button md-raised md-primary layout-fill href=\"./sell\">Sell</md-button>\r" +
    "\n" +
    "\t</md-content>\r" +
    "\n" +
    "</md-sidenav>"
  );


  $templateCache.put('app/featureSets/portfolio/portfolio.html',
    "<!-- PORTFOLIO SECTION START -->\r" +
    "\n" +
    "<section id=\"portfolio\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container-fluid section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-12 text-center\">\r" +
    "\n" +
    "                    <h2 class=\"section-title\">My Portfolio</h2>\r" +
    "\n" +
    "                    <p class=\"section-subtitle\">Here are some of my recent projects.</p>\r" +
    "\n" +
    "                    <span class=\"divider\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-12 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "            <!-- PORTFOLIO START -->\r" +
    "\n" +
    "            <div id=\"portfolio-gallery\" class=\"portfolio\">\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.moviepro.info\" image-src=\"assets/images/portfolio/moviepro.png\"> \r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>JQuery</p>                   \r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Postgres</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.sjwjobs.org\" image-src=\"assets/images/portfolio/sjwjobs.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>Prototypes</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Oracle</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.phoenixboule.com\" image-src=\"assets/images/portfolio/phoenixBoule.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>Prototypes</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Oracle</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"elizabethRendon.com\" image-src=\"assets/images/portfolio/elizabethRendon.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>JQuery</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Postgres</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.mwaservices.com\" image-src=\"assets/images/portfolio/mountainWestAgencyServices.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>JQuery</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>PHP</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Postgres</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.scfaz.com\" image-src=\"assets/images/portfolio/scfaz.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>JQuery</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>PHP</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>Postgres</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.copperpoint.com\" image-src=\"assets/images/portfolio/copperpoint_main.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>AngularJs</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>MSSQL</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div egr-image-card title=\"www.agencyPort.com\" image-src=\"assets/images/portfolio/agencyPort1.png\">\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>JAVASCRIPT:&nbsp;</strong>Prototypes</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>LANG:&nbsp;</strong>Java</p>\r" +
    "\n" +
    "                        <p class=\"text-colored-grey\"><strong>DB:&nbsp;</strong>MSSQL</p>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.row -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- PORTFOLIO END -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container-fluid -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //PORTFOLIO SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/resume/profile.html',
    "<!-- PROFILE SECTION START -->\r" +
    "\n" +
    "<section id=\"profile\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-7\">\r" +
    "\n" +
    "                    <!-- PROFILE TEXT START -->\r" +
    "\n" +
    "                    <div class=\"profile-text padding-right-yes\">\r" +
    "\n" +
    "                        <div class=\"row\">\r" +
    "\n" +
    "                            <div class=\"col-md-12\">\r" +
    "\n" +
    "                                <h2 class=\"section-title\">Hi, My Name is Ernesto</h2>\r" +
    "\n" +
    "                                <p>\r" +
    "\n" +
    "                                    I am a highly motivated creative developer with a wide range of client portfolios in the government and private sector.\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                                <span class=\"divider\"></span>\r" +
    "\n" +
    "                                <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                    Developer of all things J2EE, currently focusing on web portal development with Java, Spring MVC, Javascript, and Node. I enjoy working with various client side technologies. I prefer to do front/middle end development.\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                                <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                    I currently work at CopperPoint Mutual Insurance Company, where I spend most of my time developing software solutions and just making it awesome!\r" +
    "\n" +
    "                                </p>\r" +
    "\n" +
    "                                <!-- <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                    I was born and rasied in southern Arizona. I love the Arizona heat. Let's be realistic it is not a dry heat, it's a oven heat.\r" +
    "\n" +
    "                                </p> -->\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.col-md-12 -->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.row -->\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //PROFILE TEXT END -->\r" +
    "\n" +
    "                    <!-- CONTACT DETAILS START -->\r" +
    "\n" +
    "                    <div class=\"contact-details\">\r" +
    "\n" +
    "                        <div class=\"row\">\r" +
    "\n" +
    "                            <div egr-page-scroll id=\"resumeButtonId\" class=\"col-md-12\">\r" +
    "\n" +
    "                                <div class=\"page-scroll text-center\">\r" +
    "\n" +
    "                                    <a href=\"#resume\" class=\"btn btn-lg btn-custom\">\r" +
    "\n" +
    "                                        <i class=\"icon-File-Download\"></i> My Resume\r" +
    "\n" +
    "                                    </a>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //CONTACT DETAILS END -->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-7 -->\r" +
    "\n" +
    "                <!-- PROFILE PICTURE START -->\r" +
    "\n" +
    "                <div class=\"col-md-5 hidden-xs hidden-sm pp-wrapper\">\r" +
    "\n" +
    "                    <div class=\"profile-picture style-one\">\r" +
    "\n" +
    "                        <img src=\"assets/images/profile-picture-1.jpg\" alt=\"profile picture\" class=\"img-responsive\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //PROFILE PICTURE END -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //PROFILE SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/resume/resume.html',
    "<!-- RESUME SECTION START -->\r" +
    "\n" +
    "<section id=\"resume\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-8 col-md-offset-2 text-center\">\r" +
    "\n" +
    "                    <h2 class=\"section-title\">My Resume</h2>\r" +
    "\n" +
    "                    <p class=\"section-subtitle\">\r" +
    "\n" +
    "                        \"A journey of a thousand miles begins with a single step.\" &nbsp;&nbsp;&nbsp;&nbsp;<strong>― Lao Tzu</strong>\r" +
    "\n" +
    "                    </p>\r" +
    "\n" +
    "                    <span class=\"divider\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- EDUCATION START -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-10 col-md-offset-1\">\r" +
    "\n" +
    "                    <h3>Education</h3>\r" +
    "\n" +
    "                    <div class=\"panel-group resume\" id=\"education\">\r" +
    "\n" +
    "                        <div class=\"resume-item\">\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#education1\" data-toggle=\"collapse\" data-parent=\"#education\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">University of Arizona</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"education1\" class=\"panel-collapse collapse in\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>\r" +
    "\n" +
    "                                            Bachelor of Science: Computer Engineering\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- EDUCATION END -->\r" +
    "\n" +
    "            <!-- Qualifications START -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-10 col-md-offset-1\">\r" +
    "\n" +
    "                    <h3>Qualifications</h3>\r" +
    "\n" +
    "                    <div class=\"panel-group resume\" id=\"qualifications\">\r" +
    "\n" +
    "                        <div class=\"resume-item\">\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#qualifications1\" data-toggle=\"collapse\" data-parent=\"#qualifications\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">Languages</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"qualifications1\" class=\"panel-collapse collapse in\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>\r" +
    "\n" +
    "                                            Java, Visual Basic, C, PL/SQL, PHP, Bash Shell Scripting, Apache Ant, JavaScript, Typescript, Prototype, JQuery, Angular, Apache Velocity, XML, HTML5, XHTML\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"resume-item\" egr-animate-in-view animate-css=\"animated bounceInUp\">\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#qualifications2\" class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#qualifications\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">J2EE Technologies</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"qualifications2\" class=\"panel-collapse collapse\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>\r" +
    "\n" +
    "                                            Java Server Pages (JSP), Java Server Faces (JSF), Spring MVC, WebObjects\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"resume-item\" egr-animate-in-view animate-css=\"animated bounceInUp\">\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#qualifications3\" class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#qualifications\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">Database</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"qualifications3\" class=\"panel-collapse collapse\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>\r" +
    "\n" +
    "                                            Oracle 11g, PostgreSQL 9.1, MS SQL 2012, MySQL, JDBC, Hibernate, MyBatis\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"resume-item\" egr-animate-in-view animate-css=\"animated bounceInUp\">\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#qualifications4\" class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#qualifications\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">Miscellaneous</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <div id=\"qualifications4\" class=\"panel-collapse collapse\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>\r" +
    "\n" +
    "                                            Web Services (XML/JSON-RPC, REST, SOAP, etc), Version Control (GIT/CVS/SVN) Apache/Tomcat/JBoss, LDAP, Active Directory, LAMP Management.\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- Qualifications END -->\r" +
    "\n" +
    "            <!-- WORK EXPERIENCE START -->\r" +
    "\n" +
    "            <div class=\"row work-experience\">\r" +
    "\n" +
    "                <div class=\"col-md-10 col-md-offset-1\">\r" +
    "\n" +
    "                    <h3>Work Experience</h3>\r" +
    "\n" +
    "                    <div class=\"panel-group resume\" id=\"work\">\r" +
    "\n" +
    "                        <div class=\"resume-item\">\r" +
    "\n" +
    "                            <div class=\"resume-year\">\r" +
    "\n" +
    "                                <span class=\"resume-year\">2012 - Now</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-year -->\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#work1\" data-toggle=\"collapse\" data-parent=\"#work\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-btn -->\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">CopperPoint Mutual Insurance    -   Software Engineer Sr.</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-title -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-heading -->\r" +
    "\n" +
    "                                <div id=\"work1\" class=\"panel-collapse collapse in\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p class=\"bold\">Consumer Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Responsible for UI development to manage customer account data, make payments, and interface between old and new systems. </li>\r" +
    "\n" +
    "                                            <li> Worked on multiple stories/requirements for development of J2EE java application with Liferay 6.2, Spring MVC, and MyBatis </li>\r" +
    "\n" +
    "                                            <li> Implemented responsive web design for mobile, tablet, or desktop display </li>\r" +
    "\n" +
    "                                            <li> Usage of SOAP services to implement CRUD UI design pattern. Generation of SOAP java stubs with Apache CXF </li>\r" +
    "\n" +
    "                                            <li> Implemented deployment and automated runs of unit tests via ANT scripts. Install and setup of Jenkins CI for the project. </li>\r" +
    "\n" +
    "                                            <li> Setup of web server on Redhat VM with Tomcat 7 </li>\r" +
    "\n" +
    "                                            <li> Wrote Java JUnit unit and integration tests </li>\r" +
    "\n" +
    "                                            <li> Wrote AngularJs unit tests for code development with Karma and Jasmine </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include JSP, JavaScript, AngularJs, JQuery, Bootstrap, Java, Tomcat 7, CSS2/CSS3, SASS, XML, HTML5, SOAP, PDF generation, Ant, Jenkins, JUnit, SVN, Redhat, SOAP, JASON, MSSQL 2012, Apache Velocity, Sublime, Soap UI, Node JS, Karma, Jasmine, Grunt, and Agile/SCRUM </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Agency Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Development of UI with JSP and XPath </li>\r" +
    "\n" +
    "                                            <li> Wrote Java unit tests for code development </li>\r" +
    "\n" +
    "                                            <li> Implemented deployment and automated runs of unit tests via ANT scripts. Install and setup of Jenkins CI for the project. </li>\r" +
    "\n" +
    "                                            <li> Setup of web server on Redhat VM with JBoss 6 </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include JSP, JavaScript, Prototype, Java, JBoss 6, CSS3, XML, HTML, PDF document generation, MS SQL 2012, Ant, Jenkins, JUnit, SVN, Agile/SCRUM </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Guidewire Policy Center Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Responsible for creating client UI testing for Guidewire Portal with Selenium </li>\r" +
    "\n" +
    "                                            <li> Wrote modular Selenium UI driven tests for project </li>\r" +
    "\n" +
    "                                            <li> Created test setup data via CSV files and test outputs were set to XML </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include Selenium, TestNG, XPATH, HTML, Java, CSV, SVN, and Agile/SCRUM </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">SCF Legacy Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Responsible for maintaining, developing, and supporting a legacy web portal. </li>\r" +
    "\n" +
    "                                            <li> Enhancement of batch service process to include data feeds from new policy management system </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include PHP, JavaScript JQuery XML, HTML, CSV documents, Postgres 8, and Waterfall </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-body -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-collapse -->\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.panel -->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.resume-item -->\r" +
    "\n" +
    "                        <div class=\"resume-item\">\r" +
    "\n" +
    "                            <div class=\"resume-year\">\r" +
    "\n" +
    "                                <span class=\"resume-year\">2006-2012</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-year -->\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#work2\" data-toggle=\"collapse\" data-parent=\"#work\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-btn -->\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">Desert Sky Software - Software Engineer II</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-title -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-heading -->\r" +
    "\n" +
    "                                <div id=\"work2\" class=\"panel-collapse collapse in\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p> Responsibilities included software development, module/unit testing, application maintenance, client support, deployment of application releases. Implementation of software skills to find J2EE database driven software solutions for private/government Desert Sky clients. </p>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Sandia National Laboratories Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Numerous software enhancements and maintenance to an old software </li>\r" +
    "\n" +
    "                                            <li> Modernized of UI to use asynchronous responsive design with AJAX frameworks - Scriptaculous and Prototypes. </li>\r" +
    "\n" +
    "                                            <li> Implemented report generation for PDF, RTF, XML and EXCEL. </li>\r" +
    "\n" +
    "                                            <li> Database development - Created SQL scripts to add, delete, and/or consolidate relational tables. </li>\r" +
    "\n" +
    "                                            <li> Database development - Removal and consolidation of deprecated SQL Views. </li>\r" +
    "\n" +
    "                                            <li> Database development - Recovery and cleanup of database data cause by customer(s) or code errors. </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include JavaScript Prototype, Java, WebObjects, Project Wonder, CSS2/CSS3, XML, HTML Oracle DB, and Waterfall </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Saint Joseph The Worker Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Customer needed a cost effective e-commerce solution for collecting online credit card transitions. Key objectives include communication between multiple interfaces, transaction security, and storage of customer receipt information. </li>\r" +
    "\n" +
    "                                            <li> Enhanced a web application to allow secure on–line credit card SSL transactions, tracks and stores transactions via a database, and allows for real time reporting of customers transactions. </li>\r" +
    "\n" +
    "                                            <li> Database development - Created SQL scripts to create transaction tables. </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include JavaScript Prototype, Java, JSP, Struts, PDF, XML, CSS2/CSS3, HTML, Oracle DB, Elements, REST, and Waterfall </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Sandia Laboratories WFO Portal</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li> Customer needed an enhancement to an existing proposal work flow to show processing history. </li>\r" +
    "\n" +
    "                                            <li> Created SQL script to create new relational tables, constraints, and foreign keys to existing tables. Also created a SQL procedure used to update data and check integrity. </li>\r" +
    "\n" +
    "                                            <li> Principal technologies and tools include JavaScript Prototype, Java, PDF, RTF, XML, EXCEL, CSS2/CSS3, XML, HTML Oracle DB, PL/SQL, Bash Shell Scripting, and Waterfall </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                        <p class=\"bold\">Other Desert Sky Projects</p>\r" +
    "\n" +
    "                                        <ul>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Sandia Laboratories FWP</span> - Proposal work flow application\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Sandia Laboratories Utrack</span> - University project funding application\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Sandia Laboratories DOEDAT</span> - Project Work flow application\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Grand Canyon Minority Supplier Development Council</span> - Events Calendar\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Greater Urban Phoenix League</span> - Document Library\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Greater Phoenix Black Chamber of Commerce</span> - Document Library\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Brophy Preparatory</span> - Student admissions application\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                            <li>\r" +
    "\n" +
    "                                                <span class=\"bold\">Smart Practice</span> - Dentist appointment reminder application\r" +
    "\n" +
    "                                            </li>\r" +
    "\n" +
    "                                        </ul>\r" +
    "\n" +
    "                                        <br>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-body -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-collapse -->\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.panel -->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.resume-item -->\r" +
    "\n" +
    "                        <div class=\"resume-item\">\r" +
    "\n" +
    "                            <div class=\"resume-year\">\r" +
    "\n" +
    "                                <span class=\"resume-year\">2005-2006</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-year -->\r" +
    "\n" +
    "                            <div class=\"resume-btn\">\r" +
    "\n" +
    "                                <a href=\"#work3\" data-toggle=\"collapse\" data-parent=\"#work\"></a>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.resume-btn -->\r" +
    "\n" +
    "                            <div class=\"panel\">\r" +
    "\n" +
    "                                <div class=\"panel-heading\">\r" +
    "\n" +
    "                                    <div class=\"panel-title\">\r" +
    "\n" +
    "                                        <h4 class=\"resume-title\">First Health Coventry - Data Technician Specialist</h4>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-title -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-heading -->\r" +
    "\n" +
    "                                <div id=\"work3\" class=\"panel-collapse collapse in\">\r" +
    "\n" +
    "                                    <div class=\"panel-body text-colored-grey\">\r" +
    "\n" +
    "                                        <p>Imaging Department claim processing of digital images using Optical Character Repair software. Storage/analysis/retrieval of health insurance claims for customer service processing.\r" +
    "\n" +
    "                                        </p>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                    <!-- //.panel-body -->\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                                <!-- //.panel-collapse -->\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                            <!-- //.panel -->\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.resume-item -->\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //.panel-group -->\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-10 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //WORK EXPERIENCE END -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //RESUME SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/skills/services.html',
    "<!-- SERVICES SECTION START -->\r" +
    "\n" +
    "<section id=\"services\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-8 col-md-offset-2 text-center\">\r" +
    "\n" +
    "                    <h2 class=\"section-title\">What I Do</h2>\r" +
    "\n" +
    "                    <p class=\"section-subtitle\">\r" +
    "\n" +
    "                        \"The truest drive comes from doing what you love.\"&nbsp;&nbsp;&nbsp;&nbsp;<strong>― Peter Diamandis</strong>\r" +
    "\n" +
    "                    </p>\r" +
    "\n" +
    "                    <span class=\"divider\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-8 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "            <!-- SERVICES START -->\r" +
    "\n" +
    "            <div class=\"services\">\r" +
    "\n" +
    "                <div class=\"row\" egr-match-height>\r" +
    "\n" +
    "                    <!-- //.item -->\r" +
    "\n" +
    "                    <div class=\"col-sm-4 col-md-4 item top dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\" icon-Transform-2 text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">3. Application</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Experience with the full stack development for enterprise applications\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p/>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Front end development, application logic, services, data persistence for enterprise applications\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p/>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Development of e-commerce web applications\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p/>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Maintenance of existing web applications\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.inner-content -->\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //.item -->\r" +
    "\n" +
    "                    <div class=\"col-sm-4 col-md-4 item top dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\"icon-Chess text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">5. Development</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                J2EE: WebObjects, JSP, JSF, Spring MVC, Liferay\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Script Language: PHP, Perl, JavaScript, AJAX, jQuery, prototype, alloyui, Bootstrap, AngularJs, ANT\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Programing: Java, C\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Other: SQL, XML, CSS3, HTML5\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <!-- //.inner-content -->\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <!-- //.item -->\r" +
    "\n" +
    "                    <div class=\"col-sm-4 col-md-4 item top dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\"icon-Monitor-Tablet text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">4. Web Mobile</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Responsive design with CSS3, SASS, and/or bootstrap\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Development of web applications with WebServices: SOAP, REST, JASON, WSDL, Apache CXF, Axis2\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                IPhone development\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                            <p />\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Ionic hybrid mobile development\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "<!--                     <div class=\"col-sm-4 col-md-4 item dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\"icon-Speach-Bubble3 text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">1. Strategy</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"col-sm-4 col-md-4 item dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\"icon-Leafs-2 text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">2. Branding</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-sm-4 col-md-4 item dark-bg\">\r" +
    "\n" +
    "                        <div class=\"inner-content\">\r" +
    "\n" +
    "                            <i class=\"icon-Consulting text-colored-1\"></i>\r" +
    "\n" +
    "                            <h4 egr-animate-in-view animate-css=\"animated fadeInUp\">6. Consulting</h4>\r" +
    "\n" +
    "                            <p class=\"text-colored-grey\">\r" +
    "\n" +
    "                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\r" +
    "\n" +
    "                            </p>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div> \r" +
    "\n" +
    "-->\r" +
    "\n" +
    "                <!-- //.row -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //SERVICES END -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //SERVICES SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/skills/skills.html',
    "<!-- SKILLS SECTION START -->\r" +
    "\n" +
    "<section id=\"skills\" class=\"section\">\r" +
    "\n" +
    "    <div class=\"container section-wrapper\">\r" +
    "\n" +
    "        <div class=\"section-content\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <div class=\"col-md-8 col-md-offset-2 text-center\">\r" +
    "\n" +
    "                    <h2 class=\"section-title\">Skills & Expertise</h2>\r" +
    "\n" +
    "                    <p class=\"section-subtitle\">\r" +
    "\n" +
    "                        “This is not the end, this is not even the beginning of the end, this is just perhaps the end of the beginning.” &nbsp;&nbsp;&nbsp;&nbsp;<strong>― Winston S. Churchill</strong></p>\r" +
    "\n" +
    "                    <span class=\"divider\"></span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.col-md-8 -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //.row -->\r" +
    "\n" +
    "            <!-- CIRCLE CHART START -->\r" +
    "\n" +
    "            <div class=\"circle-chart\">\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"HTML5\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"CSS3/SASS\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"80\" value=\"Bootstrap\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"AngularJS\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"50\" value=\"Polymer\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"85\" value=\"JQuery\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"60\" value=\"TypeScript\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"50\" value=\"PHP\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"Java\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"70\" value=\"Liferay\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"60\" value=\"Ionic\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"Ant\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"80\" value=\"Jenkins\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"70\" value=\"SQL\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"Mocha Chai\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"60\" value=\"Jasmine\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"80\" value=\"Mochito\"></div>\r" +
    "\n" +
    "                    <div egr-chart-circle percent=\"90\" value=\"Selenium\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <!-- //.row -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- //CIRCLE CHART END -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.section-content -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.container -->\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //SKILLS SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/skills/strengths.html',
    "<!-- STRENGTHS SECTION START -->\r" +
    "\n" +
    "<section id=\"strengths\" class=\"strengths-bg-img bg-img-container\" style=\"min-height:400px;\">\r" +
    "\n" +
    "        <div class=\"bg-img-table-container\">\r" +
    "\n" +
    "            <div class=\"bg-img-table-cell text-center\" style=\"display:none;\">\r" +
    "\n" +
    "                <div>&nbsp;</div>\r" +
    "\n" +
    "            </div>  \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "</section>\r" +
    "\n" +
    "<!-- //STRENGTHS SECTION END -->\r" +
    "\n"
  );


  $templateCache.put('app/featureSets/topNavMenu/topNavMenu.html',
    "<!-- NAVIGATION START -->\r" +
    "\n" +
    "<nav egr-sticky-menu egr-page-scroll id=\"navigation\" class=\"navbar navbar-fixed-top center-menu\" role=\"navigation\">\r" +
    "\n" +
    "    <div class=\"container navbar-container\">\r" +
    "\n" +
    "        <div class=\"navbar-header page-scroll\">\r" +
    "\n" +
    "            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".egr-collapse\">\r" +
    "\n" +
    "                <span class=\"sr-only\">Toggle navigation</span>\r" +
    "\n" +
    "                <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "                <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "                <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.navbar-header -->\r" +
    "\n" +
    "        <div class=\"navbar-collapse collapse egr-collapse\">\r" +
    "\n" +
    "            <ul class=\"nav navbar-nav\">\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#home\">Home</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#profile\">Profile</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#portfolio\">Portfolio</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#services\">Services</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#resume\">Resume</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#skills\">Skills</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"page-scroll\">\r" +
    "\n" +
    "                    <a href=\"#contact\">Contact</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- //.navbar-collapse -->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- //.navbar-container -->\r" +
    "\n" +
    "</nav>\r" +
    "\n" +
    "<!-- //NAVIGATION END -->"
  );

}]);
