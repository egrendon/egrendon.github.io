$(function() {

    /*-------------------------------------------------------------------*/
    /*  Use window.load to wait until the images have been loaded 
    /* then animate all elements that have class 'bg-img-table-cell'
    /*-------------------------------------------------------------------*/
    $(window).load(function() {
        // executes when complete page is fully loaded, including all frames, objects and images
        setTimeout(imageTextCallback, 100);
    });





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

});
