$(function(){

    /*-------------------------------------------------------------------*/
    /*  1. Preloader. Requires jQuery jpreloader plugin.
    /*  http://www.inwebson.com/jquery/jpreloader-a-preloading-screen-to-preload-images/
    /*-------------------------------------------------------------------*/
    $(document).ready(function() {
        var jpreLoaderObj = $.fn.jpreLoader;
        if (!jpreLoaderObj) {
            throw new Error("Unable to find jpreLoader object. Verify that jpreLoader plugin is loaded.");
        }
        else {
            $('body').jpreLoader({
                showPercentage: false,
                loaderVPos: '50%'
            });
        }
    });


        
});