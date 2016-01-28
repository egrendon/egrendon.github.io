$(function() {

    /*-------------------------------------------------------------------*/
    /*  1. Preloader. Requires jQuery jpreloader plugin.
    /*  http://www.inwebson.com/jquery/jpreloader-a-preloading-screen-to-preload-images/
    /*-------------------------------------------------------------------*/
    // $(document).ready(function() {

    //     var jpreLoaderObj = $.fn.jpreLoader;

    //     //NOTE because jpreloader plugin affects the PhantomJS testing. We switched to a 
    //     //basic if check in main.js And in the test runner this plugin is diabled on purpose. 
    //     if (jpreLoaderObj) {
    //         var options = {
    //             showPercentage: false,
    //             loaderVPos: '50%',
    //             autoClose: true,
    //             debugMode: true
    //         };
    //         $('body').jpreLoader(options, imageTextCallback);
    //     } else {
    //         //the jquery jpreloader plugin was not found
    //         //just wait N seconds and then show img cell content
    //         setTimeout(imageTextCallback, 2000);
    //     }
    // });



    /**
     * This method is to show bg-img-table-cell content once the browser has loaded images.
     * But if the jquery jpreloader plugin was not found we should still calle this method.
     */
    var imageTextCallback = function() {
        $(".bg-img-table-cell").each(function(index, element) {
            $(element).css("display", "table-cell");
            $(element).addClass("animated pulse");
        });
        return true;
    };
    
});
