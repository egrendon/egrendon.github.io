$(function() {

    $(window).smartload(function() {
        "use strict";

        // Set your google maps parameters
        // // If you unable to find latitude and longitude of your address. 
        // Please visit http://www.latlong.net/convert-address-to-lat-long.html 
        // you can easily generate latitue and longitude.
        var $latitude = 33.625761,
            $longitude = -112.019004,
            $map_zoom = 10; // Zoom setting

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
        var map = new google.maps.Map(document.getElementById('google-container'), map_options);

        // Add a custom marker to the map               
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng($latitude, $longitude),
            map: map,
            visible: true,
            icon: $marker_url
        });
    });
});
