(function(_) {
    'use strict';

    angular
        .module('myFirstApp.services')
        .factory('_', underscore);



    function underscore() {
        return _;
    }

})(_);
