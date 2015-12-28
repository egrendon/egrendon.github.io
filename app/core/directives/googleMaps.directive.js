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
