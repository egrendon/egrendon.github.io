(function() {
    'use strict';

    angular
        .module('myFirstApp.topNavMenuModule')
        .controller('TopNavMenuCtrlAs', TopNavMenuCtrlAs);

    TopNavMenuCtrlAs.$inject = ['$timeout', '$window'];

    //console.dir(PrintToConsole);
    function TopNavMenuCtrlAs($timeout, $window) {
        var vm = this;

        //Scroll browser window to top
        $window.scrollTo(0, 0);
        // executes when complete page is fully loaded, including all frames, objects and images
        $timeout(function() {
            imageTextCallback();
        }, 3000);


        /**
         * This method is to show bg-img-table-cell content once the browser has loaded images.
         * But if the jquery jpreloader plugin was not found we should still calle this method.
         */
        var imageTextCallback = function() {
            $(".bg-img-table-cell").each(function(index, element) {
                $(element).css("display", "table-cell");
                $(element).addClass("animated fadeIn");
            });
            return true;
        };

    } //end of Ctrl 
})();
