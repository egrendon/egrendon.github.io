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
                url: '/home',
                /** because we have 2 'ui-view' directives on the index.html page **/
                views: {
                    "": {
                        templateUrl: '/app/featureSets/home/home.html'
                    },
                    "header": {
                        templateUrl: '/app/featureSets/home/hero.html'
                    }
                },
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

    egrAnimateInView.$inject = ['$window', '$timeout'];

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

    egrChartCircle.$inject = ['$window'];

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
                itemElement.css('height', newHeight + "px");
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

    egrMatchHeight.$inject = ['$window'];

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

	egrStickyMenu.$inject = ['$window'];

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
			element.ready(function() {
				stickyMenuHelper();
			});


			// On browser window resize event
			angular.element($window).bind('resize', function() {
				stickyMenuHelper();
			});

			/*-------------------------------------------------------------------*/
			/*  5. Make navigation menu on your page always stay visible.
			/*  Requires jQuery-Sticky plugin.
			/*-------------------------------------------------------------------*/
			var stickyMenuHelper = function() {
				var jQueryElementID = "#" + attrs.id;
				var navElement = $(jQueryElementID);
				var maxWidth = Math.max($(window).width(), window.innerWidth);

				if ($.fn.unstick) {
					navElement.unstick();
				}

				if ($.fn.sticky && maxWidth >= 992) {
					navElement.sticky({
						topSpacing: 0
					});
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
