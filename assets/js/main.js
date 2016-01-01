$(function() {

    /*-------------------------------------------------------------------*/
    /*  1. Preloader. Requires jQuery jpreloader plugin.
    /*  http://www.inwebson.com/jquery/jpreloader-a-preloading-screen-to-preload-images/
    /*-------------------------------------------------------------------*/
    $(document).ready(function() {

        var jpreLoaderObj = $.fn.jpreLoader;

        //NOTE because jpreloader plugin affects the PhantomJS testing. We switched to a 
        //basic if check in main.js And in the test runner this plugin is diabled on purpose. 
        if (jpreLoaderObj) {
            $('body').jpreLoader({
                showPercentage: false,
                loaderVPos: '50%',
                autoClose: true,
                debugMode: true
            });
        } 
    });



});
