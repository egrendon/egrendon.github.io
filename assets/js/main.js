$(function(){

    /*-------------------------------------------------------------------*/
    /*  1. Preloader. Requires jQuery jpreloader plugin.
    /*-------------------------------------------------------------------*/
    $(document).ready(function() {
        if ($.fn.jpreLoader){
            $('body').jpreLoader({
                showPercentage: false,
                loaderVPos: '50%'
            });
        }
    });

    
    
    // /*-------------------------------------------------------------------*/
    // /*  5. Make navigation menu on your page always stay visible.
    // /*  Requires jQuery-Sticky plugin.
    // /*-------------------------------------------------------------------*/
    // var stickyMenu = function(){
    //     var ww = Math.max($(window).width(), window.innerWidth),
    //     nav = $('#navigation');

    //     if ($.fn.unstick){
    //         nav.unstick();
    //     }
        
    //     if ($.fn.sticky && ww >= 992){
    //         nav.sticky({topSpacing: 0});
    //     }
    // };
    
    // stickyMenu();
    
    // // Call stickyMenu() when window is resized.
    // $(window).smartresize(function(){
    //     stickyMenu();
    // });
    

  
    // /*-------------------------------------------------------------------*/
    // /*  9. Column Chart (Section - My Strengths)
    // /*-------------------------------------------------------------------*/
    // var columnChart = function (){
    //     $('.column-chart').find('.item-progress').each(function(){
    //         var item = $(this);
    //         var newHeight = $(this).parent().height() * ($(this).data('percent') / 100);
            
    //         item.css('height', newHeight);
    //     });
    // };
    
    // // Call columnChart() when window is loaded.
    // $(window).smartload(function(){
    //     columnChart();
    // });
    
    
    /*-------------------------------------------------------------------*/
    /*  10. Section - My Resume
    /*-------------------------------------------------------------------*/
    // var resumeCollapse = function (){
    //     var ww = Math.max($(window).width(), window.innerWidth),
    //     workItem = $('.collapse:not(:first)', '#work'),
    //     educationItem = $('.collapse:not(:first)', '#education');
        
    //     if (ww < 768){
    //         workItem.collapse('show');
    //         educationItem.collapse('show');
    //     }
    //     else{
    //         workItem.collapse('hide');
    //         educationItem.collapse('hide');
    //     }
    // };
    
    // // Call resumeCollapse() when window is loaded.
    // $(window).smartload(function(){
    //     resumeCollapse();
    // });
    
    // // Call resumeCollapse() when window is resized.
    // $(window).smartresize(function(){
    //     resumeCollapse();
    // });
        
});